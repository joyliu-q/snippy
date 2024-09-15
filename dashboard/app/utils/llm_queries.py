import os.path

import dspy
import dotenv
import typing as t
import re
import requests
from jupyterlab.semver import rsort

from pydantic import BaseModel, Field


class DockerFileQuerySignature(dspy.Signature):
    """
        write a docker image that contains all the environments described in the description

        make sure to add a configuration to allow ssh into this container.
        make sure that this environment contains python, if it is not specified already
        make sure to expose port 22 as well and not the inputted port
        users should be able to ssh into this container and interactively use it without any password
        make sure python is installed in the environment

        an example of Dockerfile that is generated for python is as follows:

    FROM python:3.8
    RUN apt-get update && apt-get install -y openssh-server
    RUN mkdir /var/run/sshd
    RUN passwd -d root
    RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
    RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
    RUN sed -i 's/#PermitEmptyPasswords no/PermitEmptyPasswords yes/' /etc/ssh/sshd_config
    RUN sed -i 's/#UsePAM yes/UsePAM no/' /etc/ssh/sshd_config
    """

    description = dspy.InputField()
    docker_file_text = dspy.OutputField(description="only the dockerfile text")


def extract_code(code_text: str):
    res = re.search(r'```.*([\s\S]*?)```', code_text)
    if not res:
        return code_text
    return res.groups(1)[0]


class DockerFileGenerator(dspy.Module):
    def __init__(self):
        super().__init__()
        # we can also use ChainOfThought
        self.predict = dspy.Predict(DockerFileQuerySignature)

    def forward(self, prompt):
        res = self.predict(description=prompt)
        return extract_code(res.docker_file_text)


# setup
dotenv.load_dotenv()

# setup llm
llm = dspy.OpenAI(model="gpt-4o", max_tokens=1000, model_type="chat")
dspy.settings.configure(lm=llm)


docker_file_gen = DockerFileGenerator()


def get_docker_file(prompt: str) -> str:
    return docker_file_gen(prompt)


#####################################################

# class SummaryQuerySignature(dspy.Signature):
#     """
#     evaluate the code in terms of correctness
#     """
#     code = dspy.InputField()
#     eval_metric = dspy.InputField()
#     feedback_summary = dspy.OutputField()
#
#
# def eval_code(code: str):
#     pass


class AnnotateQuerySignature(dspy.Signature):
    """
    put comments in the code string wherever some improvement can be applied
    do not add any extra lines to the code. Just add comments.
    metrics to be assessed are: correctness, readability, and simplicity
    comments are not necessary to achieve readability score
    """

    code = dspy.InputField()
    goal = dspy.InputField(description="the goal that the code is trying to achieve")
    annotated_code = dspy.OutputField(
        description="the code annotated with comments. don't add any new code (just comments). Only comment the lines that need improvement."
    )
    feedback = dspy.OutputField(description="assessment of the quality of the code")
    readability_score = dspy.OutputField(
        description="just a number. readability score in the scale of 0 (worst) to 100 (best)"
    )
    correctness_score = dspy.OutputField(
        description="just a number. correctness score in the scale of 0 (worst) to 100 (best)"
    )
    improvement_tips = dspy.OutputField(
        description="just a number. up to 5 things (just keywords, comma seperated) that can be improved"
    )


class AnnotationGenerator(dspy.Module):
    def __init__(self):
        super().__init__()
        self.predict = dspy.ChainOfThought(AnnotateQuerySignature)

    def forward(self, code, goal):
        return self.predict(code=code, goal=goal)


annot_gen = AnnotationGenerator()


class ProgressSnapshot(BaseModel):
    code: str
    annotated_code: str
    readability_score: int  # between 0 to 100
    correctness_score: int  # between 0 to 100
    improvement_tips: str


class CodeFile(BaseModel):
    filename: str
    code_str: str


class Project(BaseModel):
    goal: str
    code_files: t.List[CodeFile]


def combine_codes(project_code: Project):
    result = ""
    for code_file in project_code.code_files:
        result += "<<<filename: " + code_file.filename + ">>>" + "\n\n"
        result += code_file.code_str + "\n\n"
    return result


def get_number(num_text: str):
    num_text = num_text.strip()
    pt = len(num_text)
    for i in range(len(num_text)):
        if not num_text[i].isdigit():
            pt = i
            break
    if pt == 0:
        return 0
    return int(num_text[: pt + 1])


def capture_progress_snapshot(project: Project) -> ProgressSnapshot:
    combined_code = combine_codes(project)
    res = annot_gen(code=combined_code, goal=project.goal)
    return ProgressSnapshot(
        code=combined_code,
        annotated_code=res.annotated_code, # TODO instead of string we should match the comments to the lines
        readability_score=get_number(res.readability_score),  # res.readability_score
        correctness_score=get_number(res.correctness_score),  # res.correctness_score
        improvement_tips=res.improvement_tips,
    )


def get_request_pydantic_model(env_url: str, model):
    try:
        response = requests.get(env_url)
        if response.status_code == 200:
            data = response.text
            item = model.model_validate_json(data)  # Parse the JSON into the Pydantic model
            return item
    except Exception as e:
        print("Failed to fetch or parse data")
        raise e

def capture_progress_snapshot_by_url(env_url: str) -> ProgressSnapshot:
    req_url = os.path.join(env_url, "project")
    project: Project = get_request_pydantic_model(req_url, Project)
    return capture_progress_snapshot(project)


if __name__ == "__main__":
    res = capture_progress_snapshot_by_url("http://127.0.0.1:5000")
    print(res.annotated_code)
    print(res.correctness_score)
    print(res.readability_score)
    print(res.improvement_tips)

    # res = get_docker_file("I want a python 3.12 environment with flask installed. supporting numpy")
    # # res = get_docker_file("a simple python environment")
    # print("the docker command")
    # print(res)


#     def show_progress(progress):
#         print(progress.annotated_code)
#         print('read', progress.readability_score)
#         print('correctness', progress.correctness_score)
#         print('tips', progress.improvement_tips)
#
#     show_progress(capture_progress_snapshot(code_files=[CodeFile(filename="helloworld.py", code_str="""
# def hello_world():
#     a = 2
# """)],
#                 goal="write a function to print hello world"
#     ))
#
#     print("----------------------------")
#
#     show_progress(capture_progress_snapshot(code_files=[CodeFile(filename="helloworld.py", code_str="""
# def hello_world():
#     return "hello world"
# """)],
#                 goal="write a function to print hello world"
#     ))
#
#     print("----------------------------")
#     show_progress(capture_progress_snapshot(code_files=[CodeFile(filename="helloworld.py", code_str="""
#     def hello_world():
#         print("hello world")
#     """)],
#                 goal="write a function to print hello world"
#     ))

import dspy
import dotenv


class DockerFileQuerySignature(dspy.Signature):
    """
        write a docker image that contains all the environments described in the description

        make sure ssh is installed on the server
        users should be able to ssh into this container and interactively use it without any password
        python should be installed in the docker file

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
    docker_file_text = dspy.OutputField()


class DockerFileGenerator(dspy.Module):
    def __init__(self):
        super().__init__()
        # we can also use ChainOfThought
        self.predict = dspy.Predict(DockerFileQuerySignature)

    def forward(self, prompt):
        return self.predict(description=prompt)


# setup
dotenv.load_dotenv()
docker_file_gen = DockerFileGenerator()

# setup llm
turbo = dspy.OpenAI(model="gpt-4o", max_tokens=1000, model_type="chat")
dspy.settings.configure(lm=turbo)


def get_docker_file(prompt: str):
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

    summarize the comments at the end
    """
    code = dspy.InputField()
    goal = dspy.InputField(description="the goal that the code is trying to achieve")
    annotated_code = dspy.OutputField(description="the code annotated with comments")
    feedback = dspy.OutputField(description="assessment of the quality of the code")
    readability_score = dspy.OutputField(description="just a number. readability score in the scale of 0 (worst) to 100 (best)")
    correctness_score = dspy.OutputField(description="just a number. correctness score in the scale of 0 (worst) to 100 (best)")
    improvement_tips = dspy.OutputField(description="just a number. up to 5 things (just keywords, comma seperated) that can be improved")


class AnnotationGenerator(dspy.Module):
    def __init__(self):
        super().__init__()
        self.predict = dspy.ChainOfThought(AnnotateQuerySignature)

    def forward(self, code, goal):
        return self.predict(code=code, goal=goal)


if __name__ == "__main__":
    # res = get_docker_file("a simple python environment")
    # print("the docker command")
    # print(res.docker_file_text)


    annot = AnnotationGenerator()

    res = annot(code="""
def hello_world():
    a = 2
""",
                goal="write a function to print hello world"
    )
    print(res.annotated_code)
    print("feedback_summary")
    print(res.feedback)
    print(res)

    print('----------------------------')

    res = annot(code="""
def hello_world():
    return "hello world"
""",
                goal="write a function to print hello world"
    )
    print(res.annotated_code)
    print("feedback_summary")
    print(res.feedback)
    print(res)


    print("----------------------------")
    res = annot(code="""
    def hello_world():
        print("hello world")
    """,
                goal="write a function to print hello world"
                )
    print(res.annotated_code)
    print("feedback_summary")
    print(res.feedback)
    print(res)

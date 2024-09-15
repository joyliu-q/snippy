from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import typing as t

from app.utils import EnvironmentConfig, DEFAULT_DOCKERFILE_CONTENT, ProgressSnapshot
from faker import Faker
from fastapi.middleware.cors import CORSMiddleware

# from app.docker_logic import create_docker_containers
from app.utils import get_docker_file
from app.k8s_logic import create_kubernetes_deployments

app = FastAPI()
fake = Faker()

ENVS_DATABASE_TOTALLY: t.Dict[str, EnvironmentConfig] = {}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update this with your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Request body model to handle input
class ContainerRequest(BaseModel):
    num_containers: int
    dockerfile_content: t.Optional[str] = Field(
        DEFAULT_DOCKERFILE_CONTENT, description="Optional custom Dockerfile content"
    )


class Student(BaseModel):
    name: str
    email: str
    ssh_command: str
    feedback: str


class SmartContainerRequest(BaseModel):
    num_containers: int
    prompt: str


class StudentResponse(BaseModel):
    status: str = "success"
    students: t.List[Student]
    dockerfile: t.Optional[str]


def spin_up_containers(
    num_containers, dockerfile_content=DEFAULT_DOCKERFILE_CONTENT
) -> StudentResponse:
    try:
        envs = create_kubernetes_deployments(num_containers, dockerfile_content)
        students = []
        for env in envs:
            ENVS_DATABASE_TOTALLY[env.ssh_command] = env
            students.append(
                Student(
                    name=fake.name(),
                    email=fake.email(),
                    ssh_command=env.ssh_command,
                    feedback="TODO: add feedback lol",
                )
            )
        return StudentResponse(
            status="success", students=students, dockerfile=dockerfile_content
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An error occurred: {str(e)}"
        ) from e


# def spin_up_containers(num_containers, dockerfile_content):
#     try:
#         ssh_commands = create_docker_containers(num_containers, dockerfile_content)

#         return {"status": "success", "ssh_commands": ssh_commands}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/create_envs/manual")
async def create_envs_manual(request: ContainerRequest) -> StudentResponse:
    num_containers = request.num_containers
    dockerfile_content = request.dockerfile_content
    return spin_up_containers(
        num_containers=num_containers, dockerfile_content=dockerfile_content
    )


@app.post("/create_envs")
async def create_envs(request: SmartContainerRequest) -> StudentResponse:
    num_containers = request.num_containers
    dockerfile_content = get_docker_file(request.prompt)
    return spin_up_containers(
        num_containers=num_containers, dockerfile_content=dockerfile_content
    )


class StudentsResponse(BaseModel):
    students: t.List[Student]


@app.get("/students")
async def get_students():
    students = [
        Student(
            name=fake.name(),
            email=fake.email(),
            ssh_command=e.ssh_command,
            feedback="Lorem ipsum",
        )
        for e in ENVS_DATABASE_TOTALLY.values()
    ]
    return StudentsResponse(students=students)


class FeedbacksResponse(BaseModel):
    feedbacks: t.List[ProgressSnapshot]


@app.get("/feedback")
async def get_feedbacks() -> FeedbacksResponse:
    feedbacks = []
    return FeedbacksResponse(feedbacks=feedbacks)

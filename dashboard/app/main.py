from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import typing as t

from faker import Faker

# from app.docker_logic import create_docker_containers
from app.utils import get_docker_file
from app.k8s_logic import create_kubernetes_deployments

app = FastAPI()
fake = Faker()


# Request body model to handle input
class ContainerRequest(BaseModel):
    num_containers: int
    dockerfile_content: t.Optional[str] = Field(
        None, description="Optional custom Dockerfile content"
    )


class Student(BaseModel):
    name: str = "yo"
    email: str = "lmao"
    ssh_command: str
    feedback: str


class SmartContainerRequest(BaseModel):
    num_containers: int
    prompt: str


class StudentResponse(BaseModel):
    status = "success"
    students: t.List[Student]
    dockerfile: str


def spin_up_containers(num_containers, dockerfile_content) -> StudentResponse:
    try:
        ssh_commands = create_kubernetes_deployments(num_containers, dockerfile_content)
        students = []
        for command in ssh_commands:
            students.append(
                Student(
                    name=fake.name(),
                    email=fake.email(),
                    ssh_command=command,
                    feedback="TODO: add feedback lol",
                )
            )
        return StudentResponse(ssh_commands=students, dockerfile=dockerfile_content)
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
async def create_envs_manual(request: ContainerRequest):
    num_containers = request.num_containers
    dockerfile_content = request.dockerfile_content
    return spin_up_containers(
        num_containers=num_containers, dockerfile_content=dockerfile_content
    )


@app.post("/create_envs")
async def create_envs(request: SmartContainerRequest):
    num_containers = request.num_containers
    dockerfile_content = get_docker_file(request.prompt)
    return spin_up_containers(
        num_containers=num_containers, dockerfile_content=dockerfile_content
    )

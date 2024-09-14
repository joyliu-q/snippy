from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from app.docker_logic import create_docker_containers

app = FastAPI()


# Request body model to handle input
class ContainerRequest(BaseModel):
    num_containers: int
    dockerfile_content: Optional[str] = Field(
        None, description="Optional custom Dockerfile content"
    )


class SmartContainerRequest(BaseModel):
    num_containers: int
    prompt: str


async def spin_up_containers(num_containers, dockerfile_content):
    try:
        ssh_commands = create_docker_containers(num_containers, dockerfile_content)

        return {"status": "success", "ssh_commands": ssh_commands}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/create_envs")
async def create_envs(request: ContainerRequest):
    num_containers = request.num_containers
    dockerfile_content = request.dockerfile_content
    spin_up_containers(
        num_containers=num_containers, dockerfile_content=dockerfile_content
    )


@app.post("/create_envs/text")
async def create_envs_text(request: SmartContainerRequest):
    pass

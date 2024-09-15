from click import prompt
from fastapi import FastAPI, HTTPException
from jedi import get_default_project
from pydantic import BaseModel, Field
import typing as t
import redis

from app.utils import (
    EnvironmentConfig,
    get_docker_file,
    DEFAULT_DOCKERFILE_CONTENT,
    ProgressSnapshot,
    capture_progress_snapshot_by_url,
)
from app.utils import generate_project, generate_default_project

from faker import Faker
from fastapi.middleware.cors import CORSMiddleware

# from app.docker_logic import create_docker_containers
from app.k8s_logic import create_kubernetes_deployments

from utils.llm_queries import Project

app = FastAPI()
fake = Faker()


class StudentEnv(BaseModel):
    env_name: str
    name: str
    email: str
    ssh_command: str
    summary_server_url: str
    feedback: str

    def save_to_redis(self):
        """Save student env details to Redis"""
        redis_client.hset(f"student-{self.ssh_command}", mapping=self.dict())

    @staticmethod
    def get_from_redis(env_name: str, ssh_command: str) -> "StudentEnv":
        """Get student env details from Redis"""
        student_data = redis_client.hget(
            name=f"student-{ssh_command}", key=f"student-{env_name}"
        )
        return StudentEnv(**student_data)


class Environment(BaseModel):
    status: str = "success"
    env_name: str
    students: t.List[StudentEnv]
    dockerfile: t.Optional[str]

    def save_to_redis(self):
        """Save environment details to Redis"""
        redis_client.hset(f"env-{self.env_name}", mapping=self.dict())

        for student in self.students:
            student.save_to_redis()

    @staticmethod
    def get_from_redis(env_name: str) -> "Environment":
        """Get environment details from Redis"""
        keys = redis_client.keys(f"{env_name}:*")
        students = []
        for key in keys:
            student_data = redis_client.hgetall(key)
            students.append(StudentEnv(**student_data))
        return students

    @staticmethod
    def get_all_from_redis() -> t.List["Environment"]:
        """Get all environments from Redis"""
        env_keys = redis_client.keys("env-*")
        environments = []

        for env_key in env_keys:
            env_data = redis_client.hgetall(env_key)
            if env_data:
                students = []
                student_keys = redis_client.keys("student-*")
                for key in student_keys:
                    student_data = redis_client.hgetall(key)
                    students.append(StudentEnv(**student_data))

                environments.append(Environment(**env_data, students=students))

        return environments


ENVS_DATABASE_TOTALLY: t.Dict[str, StudentEnv] = {}
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)


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


class SmartContainerRequest(BaseModel):
    num_containers: int
    prompt: str
    project_prompt: str = ""

def spin_up_containers(
    num_containers, project: Project, dockerfile_content=DEFAULT_DOCKERFILE_CONTENT
) -> Environment:
    try:
        env_configs = create_kubernetes_deployments(num_containers, dockerfile_content, project=project)
        students = []
        for env_config in env_configs:
            env = StudentEnv(
                env_name=env_config.env_name,
                name=fake.name(),
                email=fake.email(),
                ssh_command=env_config.ssh_command,
                summary_server_url=env_config.summary_server_url,
                feedback="No feedback yet, student just started",
            )
            ENVS_DATABASE_TOTALLY[env.ssh_command] = env
            students.append(env)
        return Environment(
            env_name=env_configs[0].env_name,  # TODO: handle validation if 0 specified
            status="success",
            students=students,
            dockerfile=dockerfile_content,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An error occurred: {str(e)}"
        ) from e


@app.post("/create_envs/manual")
async def create_envs_manual(request: ContainerRequest) -> Environment:
    num_containers = request.num_containers
    dockerfile_content = request.dockerfile_content
    project = generate_project(goal=request.project_prompt) if request.project_prompt else generate_default_project()
    return spin_up_containers(
        num_containers=num_containers, dockerfile_content=dockerfile_content, project=project
    )


@app.post("/create_envs")
async def create_envs(request: SmartContainerRequest) -> Environment:
    num_containers = request.num_containers
    dockerfile_content = get_docker_file(request.prompt)
    project = generate_project(goal=request.project_prompt) if request.project_prompt else generate_default_project()
    return spin_up_containers(
        num_containers=num_containers, dockerfile_content=dockerfile_content, project=project
    )


class StudentsResponse(BaseModel):
    students: t.List[StudentEnv]


@app.get("/students")
async def get_students() -> StudentsResponse:
    students = []
    existing_envs = Environment.get_all_from_redis()
    for e in [*ENVS_DATABASE_TOTALLY.values(), *existing_envs]:
        try:
            feedback = capture_progress_snapshot_by_url(
                env_url=e.summary_server_url
            ).improvement_tips
            env = StudentEnv(
                env_name=e.env_name,
                name=fake.name(),
                email=fake.email(),
                ssh_command=e.ssh_command,
                summary_server_url=e.summary_server_url,
                feedback=feedback,
            )
        except Exception as exc:
            print(exc)
            env = StudentEnv(
                env_name=e.env_name,
                name=fake.name(),
                email=fake.email(),
                ssh_command=e.ssh_command,
                summary_server_url=e.summary_server_url,
                feedback=f"Something went wrong when fetching feedback ${e}",
            )
        env.save_to_redis()
        students.append(env)
    return StudentsResponse(students=students)

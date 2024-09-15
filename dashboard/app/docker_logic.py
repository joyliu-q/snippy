import shutil
import tempfile
import time
import typing as t
import uuid
import socket
import os

from app.utils import run_command, DEFAULT_DOCKERFILE_CONTENT, EnvironmentConfig


def _build_docker_image(dockerfile_content: str, image_name: str):
    with tempfile.TemporaryDirectory() as temp_dir:
        shutil.copytree("./common", os.path.join(temp_dir, "common"))
        dockerfile_path = os.path.join(temp_dir, "Dockerfile")

        if not dockerfile_content:
            dockerfile_content = DEFAULT_DOCKERFILE_CONTENT

        with open(dockerfile_path, "w", encoding="utf-8") as f:
            f.write(dockerfile_content)

        build_command = f"docker build -t {image_name} {temp_dir}"
        print(f"Building Docker image {image_name}...")
        run_command(
            build_command,
        )


def wrap_docker_image(dockerfile_content: str, image_name: str) -> str:
    """Include summarization monitor code in user docker image."""

    inner_image_name = f"{image_name}-inner"
    _build_docker_image(
        dockerfile_content=dockerfile_content, image_name=inner_image_name
    )

    # TODO: make main.py a binary
    wrapped_dockerfile_content = f"""
FROM {inner_image_name}

# All set-up scripts live in /etc/scripty
COPY ./common /etc/scripty

# TODO hacky, later we want not hardcoded started code
COPY ./common/projects/python_helloworld /home/project
RUN pip install -r /etc/scripty/server/requirements.txt

EXPOSE 5000
EXPOSE 22

CMD python /etc/scripty/server/main.py & /usr/sbin/sshd -D
"""

    _build_docker_image(
        dockerfile_content=wrapped_dockerfile_content, image_name=image_name
    )


def find_available_ports(
    num_ports: int, start_port_range: int = 8000, end_port_range: int = 9000
) -> t.List[int]:
    available_ports = []
    for port in range(start_port_range, end_port_range + 1):
        if len(available_ports) == num_ports:
            break
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("", port))
                available_ports.append(port)
            except OSError:
                continue
    return available_ports if len(available_ports) == num_ports else []


def create_docker_containers(
    num_containers: int,
    dockerfile_content: t.Optional[str] = None,
    env_name: t.Optional[str] = None,
    start_port_range: int = 8000,
    end_port_range: int = 9000,
) -> t.List[EnvironmentConfig]:

    if not env_name:
        env_name = uuid.uuid4()

    environments = []
    image_name = f"image-{env_name}"
    wrap_docker_image(dockerfile_content=dockerfile_content, image_name=image_name)

    ports = find_available_ports(
        num_ports=num_containers * 2,
        start_port_range=start_port_range,
        end_port_range=end_port_range,
    )
    for i in range(num_containers):
        container_name = f"container-{env_name}-{i+1}"

        port_one = ports[i]
        port_two = ports[num_containers + i]
        run_command(
            f"docker run -d --name {container_name} -p {port_one}:22 -p {port_two}:5000 {image_name}"
        )
        container_name = f"container-{env_name}-{i+1}"

        time.sleep(1)

        ssh_command = f"ssh root@localhost -p {port_one}"
        http_url = f"localhost:{port_two}"
        environments.append(
            EnvironmentConfig(ssh_command=ssh_command, summary_server_url=http_url)
        )

    return environments

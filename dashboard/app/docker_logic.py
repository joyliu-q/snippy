import time
import typing as t
import uuid
import socket

from app.utils import run_command, wrap_docker_image


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
):

    if not env_name:
        env_name = uuid.uuid4()

    ssh_commands = []
    image_name = f"image-{env_name}"
    wrap_docker_image(dockerfile_content=dockerfile_content, image_name=image_name)

    ports = find_available_ports(
        num_ports=num_containers,
        start_port_range=start_port_range,
        end_port_range=end_port_range,
    )
    for i in range(num_containers):
        container_name = f"container-{env_name}-{i+1}"

        port = ports[i]
        run_command(f"docker run -d --name {container_name} -p {port}:22 {image_name}")
        container_name = f"container-{env_name}-{i+1}"

        time.sleep(1)

        ssh_command = f"ssh root@localhost -p {port}"
        ssh_commands.append(ssh_command)

    return ssh_commands

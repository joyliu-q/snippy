import os
import shutil
import subprocess
import tempfile
import typing as t

from app.utils import DEFAULT_DOCKERFILE_CONTENT


# def run_command(command: t.List[str]):
#     """Utility function to run shell commands with real-time output visibility."""
#     print(f"Running command: {command}")

#     process = subprocess.Popen(
#         command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True
#     )

#     # Stream stdout and stderr while the command is running
#     while True:
#         output = process.stdout.readline()
#         error = process.stderr.readline()

#         if output:
#             print(f"STDOUT: {output.strip()}")  # Print the standard output in real-time
#         if error:
#             print(f"STDERR: {error.strip()}")  # Print the standard error in real-time

#         # Check if the process is done
#         return_code = process.poll()
#         if return_code is not None:
#             if return_code == 0:
#                 print(f"Command completed successfully with code {return_code}")
#             else:
#                 print(f"Command failed with code {return_code}")
#             break

#     if return_code != 0:
#         raise Exception(f"Command failed: {error.strip()}")

#     return process.stdout.read().strip()


def run_command(command: str):
    """Utility function to run shell commands with real-time output visibility."""
    print(f"Running command: {command}")

    process = subprocess.Popen(
        command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True
    )

    # Stream stdout and stderr while the command is running
    stdout, stderr = process.communicate()

    if stdout:
        print(f"STDOUT: {stdout.strip()}")
    if stderr:
        print(f"STDERR: {stderr.strip()}")

    return_code = process.returncode
    if return_code == 0:
        print(f"Command completed successfully with code {return_code}")
    else:
        print(f"Command failed with code {return_code}")
        raise Exception(f"Command failed: {stderr.strip()}")

    return stdout.strip()


def _build_docker_image(dockerfile_content: str, image_name: str):
    with tempfile.TemporaryDirectory() as temp_dir:
        shutil.copytree("./container", os.path.join(temp_dir, "container"))
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

    wrapped_dockerfile_content = f"""
FROM {inner_image_name}

EXPOSE 5000
COPY container /home/server
RUN python /home/server/main.py &
CMD ["/usr/sbin/sshd", "-D"]
        """

    _build_docker_image(
        dockerfile_content=wrapped_dockerfile_content, image_name=image_name
    )

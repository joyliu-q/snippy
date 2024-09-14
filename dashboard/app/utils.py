import subprocess


def run_command(command):
    """Utility function to run shell commands."""
    result = subprocess.run(
        command, shell=True, capture_output=True, text=True, check=True
    )
    if result.returncode != 0:
        raise Exception(f"Command failed: {result.stderr}")
    return result.stdout.strip()


DEFAULT_DOCKERFILE_CONTENT = """
FROM python:3.8
RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN passwd -d root
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PermitEmptyPasswords no/PermitEmptyPasswords yes/' /etc/ssh/sshd_config
RUN sed -i 's/#UsePAM yes/UsePAM no/' /etc/ssh/sshd_config
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
"""

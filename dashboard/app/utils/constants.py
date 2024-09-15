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


from pydantic import BaseModel


class EnvironmentConfig(BaseModel):
    ssh_command: str
    summary_server_url: str

FROM python:3.8

RUN apt-get update && apt-get install -y openssh-server

RUN mkdir /var/run/sshd
RUN passwd -d root
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PermitEmptyPasswords no/PermitEmptyPasswords yes/' /etc/ssh/sshd_config
RUN sed -i 's/#UsePAM yes/UsePAM no/' /etc/ssh/sshd_config

EXPOSE 22
EXPOSE 5000

# TODO hacky use pip requirements later
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY ./container /home/server

# TODO hacky later we want teacher to be able to submit the project through website
COPY ./projects/python_helloworld /home/project

RUN /usr/sbin/sshd -D &
CMD ["python", "/home/server/main.py"]

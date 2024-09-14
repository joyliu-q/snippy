FROM python:3.8

RUN apt-get update && apt-get install -y openssh-server

WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any necessary dependencies
RUN pip install --no-cache-dir -r requirements.txt


RUN mkdir /var/run/sshd
RUN passwd -d root
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PermitEmptyPasswords no/PermitEmptyPasswords yes/' /etc/ssh/sshd_config
RUN sed -i 's/#UsePAM yes/UsePAM no/' /etc/ssh/sshd_config
EXPOSE 22

EXPOSE 5000

COPY ./container /home/server

RUN python /home/server/main.py &
CMD ["/usr/sbin/sshd", "-D"]

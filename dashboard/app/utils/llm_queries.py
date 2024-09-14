import dspy
import dotenv


class DockerFileQuerySignature(dspy.Signature):
    """
        write a docker image that contains all the environments described in the description

        make sure to add a configuration to allow ssh into this container.
        make sure to expose port 22 as well and not the inputted port
        users should be able to ssh into this container and interactively use it without any password

        an example of Dockerfile that is generated for python is as follows:

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

    description = dspy.InputField()
    docker_file_text = dspy.OutputField()


class DockerFileGenerator(dspy.Module):
    def __init__(self):
        super().__init__()
        # we can also use ChainOfThought
        self.predict = dspy.Predict(DockerFileQuerySignature)

    def forward(self, prompt):
        return self.predict(description=prompt)


# setup
dotenv.load_dotenv()
docker_file_gen = DockerFileGenerator()

# setup llm
turbo = dspy.OpenAI(model='gpt-3.5-turbo-1106', max_tokens=1000, model_type='chat')
dspy.settings.configure(lm=turbo)


def get_docker_file(prompt: str):
    return docker_file_gen(prompt)


if __name__ == '__main__':
    res = get_docker_file("a simple python environment")
    print("the docker command")
    print(res.docker_file_text)

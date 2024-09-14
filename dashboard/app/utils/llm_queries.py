import dspy
import dotenv


class DockerFileQuerySignature(dspy.Signature):
    """
    write a docker image that contains all the environments described in the description

    make sure to add a configuration to allow ssh into this container.

    make sure to expose port 22 as well and not the inputted port

    users should be able to ssh into this container and interactively use it without any password
    """

    port = dspy.InputField()
    description = dspy.InputField()
    docker_file_text = dspy.OutputField()
    ssh_command = dspy.OutputField(
        description="the ssh command that the user can use to connect to the container without identity password, if possible try to use ssh root@localhost -p the inputted port"
    )


class DockerFileGenerator(dspy.Module):
    def __init__(self):
        super().__init__()
        # we can also use ChainOfThought
        self.predict = dspy.Predict(DockerFileQuerySignature)

    def forward(self, prompt, port):
        return self.predict(description=prompt, port=port)


# setup
dotenv.load_dotenv()
docker_file_gen = DockerFileGenerator()

# setup llm
turbo = dspy.OpenAI(model="gpt-3.5-turbo-1106", max_tokens=1000, model_type="chat")
dspy.settings.configure(lm=turbo)


def get_docker_file(prompt: str, port: str):
    return docker_file_gen(prompt, port=port)


if __name__ == "__main__":
    res = get_docker_file("a simple python environment", port="1000")
    print("the docker command")
    print(res.docker_file_text)
    print("-------------------")
    print("ssh command")
    print(res.ssh_command)

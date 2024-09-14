"""
Possibly the worst imperative infra code I have ever written in my entire life.
"""

import subprocess
import os
import time
import uuid

from app.utils import DEFAULT_DOCKERFILE_CONTENT, run_command, build_docker_image
import os


from kubernetes import client, config


def set_minikube_docker_env():
    result = subprocess.run(["minikube", "docker-env"], capture_output=True, text=True)

    for line in result.stdout.splitlines():
        if line.startswith("export"):
            key_value = line.replace("export ", "").replace('"', "").split("=")
            if len(key_value) == 2:
                os.environ[key_value[0]] = key_value[1]


def create_kubernetes_deployments(
    num_containers, dockerfile_content=None, env_name=None
):
    config.load_kube_config()
    core_v1_api = client.CoreV1Api()

    if not env_name:
        # TODO: this is so bad
        env_name = str(uuid.uuid4())[:8]

    image_name = f"image-{env_name}"
    dockerfile_content = (
        dockerfile_content if dockerfile_content else DEFAULT_DOCKERFILE_CONTENT
    )
    set_minikube_docker_env()
    build_docker_image(dockerfile_content=dockerfile_content, image_name=image_name)

    run_command(["minikube", "image", "load", image_name])
    time.sleep(1)

    deployment_name = f"deployment-{env_name}"
    namespace = "default"

    deployment = create_k8s_deployment(
        image_name, deployment_name, replicas=num_containers
    )
    time.sleep(10)

    pod_names = get_pod_names(deployment.metadata.name, namespace)

    ssh_commands = []
    ip = subprocess.run(
        ["minikube", "ip"], text=True, capture_output=True, check=True
    ).stdout.strip()
    for pod_name in pod_names:
        print(f"Creating service for pod: {pod_name}")
        update_pod_labels(core_v1_api, pod_name, namespace)
        service = create_k8s_service(pod_name)
        print(f"Retrieving NodePort for pod: {pod_name}")
        node_port = (
            core_v1_api.read_namespaced_service(
                name=service.metadata.name, namespace=namespace
            )
            .spec.ports[0]
            .node_port
        )

        ssh_command = f"ssh -p {node_port} root@{ip}"
        ssh_commands.append(ssh_command)

    return ssh_commands


def get_pod_names(deployment_name, namespace="default"):
    """Retrieve the names of all pods created by a deployment."""
    config.load_kube_config()
    core_v1_api = client.CoreV1Api()

    pods = core_v1_api.list_namespaced_pod(
        namespace=namespace, label_selector=f"app={deployment_name}"
    ).items
    print(pods)

    pod_names = [pod.metadata.name for pod in pods]
    return pod_names


# TODO: SOOOO BAD OMG WTF
def update_pod_labels(core_v1_api, pod_name, namespace="default"):
    """Update the pod with its name as a label."""
    body = {"metadata": {"labels": {"name": pod_name}}}  # Add the pod name as a label
    core_v1_api.patch_namespaced_pod(name=pod_name, namespace=namespace, body=body)


def create_k8s_deployment(image_name, deployment_name, namespace="default", replicas=3):
    # Define the deployment with SSH enabled on port 22
    config.load_kube_config()
    container = client.V1Container(
        name=deployment_name,
        image=image_name,
        image_pull_policy="IfNotPresent",
        ports=[client.V1ContainerPort(container_port=22)],
    )

    template = client.V1PodTemplateSpec(
        metadata=client.V1ObjectMeta(labels={"app": deployment_name}),
        spec=client.V1PodSpec(containers=[container]),
    )

    spec = client.V1DeploymentSpec(
        replicas=replicas,
        template=template,
        selector={"matchLabels": {"app": deployment_name}},
    )

    deployment = client.V1Deployment(
        api_version="apps/v1",
        kind="Deployment",
        metadata=client.V1ObjectMeta(name=deployment_name),
        spec=spec,
    )
    apps_v1_api = client.AppsV1Api()
    apps_v1_api.create_namespaced_deployment(
        body=deployment,
        namespace=namespace,
    )

    return deployment


def create_k8s_service(pod_name, namespace="default"):
    config.load_kube_config()
    service = client.V1Service(
        api_version="v1",
        kind="Service",
        metadata=client.V1ObjectMeta(name=f"{pod_name}-service"),
        spec=client.V1ServiceSpec(
            selector={"name": pod_name},
            ports=[client.V1ServicePort(port=22, target_port=22)],
            type="NodePort",
        ),
    )

    core_v1_api = client.CoreV1Api()
    core_v1_api.create_namespaced_service(
        namespace=namespace,
        body=service,
    )

    return service

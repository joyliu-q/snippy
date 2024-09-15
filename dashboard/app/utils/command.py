import subprocess


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

import subprocess


def run_command(command):
    """Utility function to run shell commands."""
    result = subprocess.run(
        command, shell=True, capture_output=True, text=True, check=True
    )
    if result.returncode != 0:
        raise Exception(f"Command failed: {result.stderr}")
    return result.stdout.strip()

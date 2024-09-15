import os
import zipfile

from flask import Flask, send_file
from io import BytesIO
from constants import CONTAINER_SERVER_PATH, CONTAINER_PROJECT_PATH, CONTAINER_SERVER_PORT
from models import CodeFile, Project

app = Flask(__name__)


def zip_directory(directory):
    """Creates an in-memory zip of the given directory."""
    zip_buffer = BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for foldername, subfolders, filenames in os.walk(directory):
            for filename in filenames:
                file_path = os.path.join(foldername, filename)
                arcname = os.path.relpath(file_path, directory)
                zip_file.write(file_path, arcname)
    zip_buffer.seek(0)
    return zip_buffer


@app.route('/download-zip', methods=['GET'])
def download_zip():
    """Endpoint to download the zipped directory."""
    zip_buffer = zip_directory(directory=CONTAINER_PROJECT_PATH)
    return send_file(
        zip_buffer,
        mimetype='application/zip',
        as_attachment=True,
        download_name='directory.zip'
    )


@app.route('/project', methods=['GET'])
def get_project():
    # TODO later ignore files such as node_modules, or maybe the ones in gitignore
    project_path = CONTAINER_PROJECT_PATH
    goal_path = os.path.join(project_path, "todo.txt")

    try:
        with open(goal_path, 'r') as f:
            goal = f.read()
    except IOError:
        goal = "implement the functions correctly"

    code_files = []
    for foldername, subfolders, filenames in os.walk(project_path):
        for filename in filenames:
            if filename.endswith(".txt"):
                # check for other non-code files as wel
                continue
            file_path = os.path.join(foldername, filename)
            with open(file_path, 'r') as f:
                code = f.read()
            code_files.append(CodeFile(code_str=code, filename=filename))
    project = Project(code_files=code_files, goal=goal)
    return project.model_dump()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=CONTAINER_SERVER_PORT)

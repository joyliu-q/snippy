import os
import zipfile

from flask import Flask, send_file
from io import BytesIO
from constants import CONTAINER_SERVER_PATH, CONTAINER_PROJECT_PATH, CONTAINER_SERVER_PORT

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


# @app.route('/summarize', methods=['GET'])
# def download_zip():
#     """endpoint to summarize the performance of the student."""
#     zip_buffer = zip_directory(directory=CONTAINER_PROJECT_PATH)
#     return send_file(
#         zip_buffer,
#         mimetype='application/zip',
#         as_attachment=True,
#         download_name='directory.zip'
#     )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=CONTAINER_SERVER_PORT)

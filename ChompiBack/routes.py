from ChompiBack import app
from ChompiBack.forms import UploadForm
from werkzeug.utils import secure_filename
import os

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

@app.route('/load-samples', methods=['POST'])
def load_samples():
    form = UploadForm();
    response = []
    for file in form.samples.data:
        filename = secure_filename(file.filename)
        file.save(os.path.join(
            app.instance_path, 'samples', filename
        ))
        response.append({
            "filename": filename,
            "status": "success"
        })

    path = os.path.join(app.instance_path, 'samples')
    
    response.append({
        "instance_path": path
    })

    return response

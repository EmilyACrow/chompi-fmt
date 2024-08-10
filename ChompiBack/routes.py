from ChompiBack import app
from ChompiBack.export import export
from ChompiBack.forms import UploadForm
#from .export import export
from werkzeug.utils import secure_filename
from flask import request
import os, shutil
import tkinter as tk;
from tkinter import filedialog;

@app.route('/')
def index():
    return app.send_static_file('index.html')

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

    return response

@app.route('/get-samples', methods=['GET'])
def get_samples():
    response = []
    for filename in os.listdir(os.path.join(app.instance_path, 'samples')):
        response.append({
            "filename": filename
        })
    return response

@app.route('/export', methods=['POST'])
def export_samples():
    return export(request)

@app.route('/delete-sample', methods=['POST'])
def delete_sample():
    data = request.json
    filename = data.get('filename')
    print(data.get('filename'))
    if(os.path.exists(os.path.join( app.instance_path, 'samples', filename))):
        os.remove(os.path.join(
            app.instance_path, 'samples', filename
        ))
        return {
            "status": "success"
        }
    else:
        return {
            "status": "error",
            "msg": "File does not exist"
        }
    
@app.route('/delete-all-samples', methods=['POST'])
def delete_all_samples():
    # Easier to just remove the samples directory and recreate it
    try:
        shutil.rmtree(os.path.join(app.instance_path, 'samples'))
    except OSError:
        pass
    try:
        os.makedirs(os.path.join(app.instance_path, 'samples'))
    except OSError as e:
        print(e)
    return {
        "status": "success"
    }
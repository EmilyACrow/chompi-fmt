from flask import Flask
from config import Config
from flask_cors import CORS
import os, shutil

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(Config)


# verify out instance path exists and reset our samples directory
try:
    shutil.rmtree(os.path.join(app.instance_path, 'samples'))
except OSError:
    pass
try:
    # os.makedirs(app.instance_path)
    os.makedirs(os.path.join(app.instance_path, 'samples'))
except OSError as e:
    print("Error:" + e)

    

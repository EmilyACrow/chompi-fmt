from flask import Flask
from config import Config
from flask_cors import CORS
import os, shutil

app = Flask(__name__, static_folder='../ChompiFront/build', static_url_path='/')
CORS(app, supports_credentials=True)
app.config.from_object(Config)


# verify out instance path exists and reset our samples directory
try:
    shutil.rmtree(os.path.join(app.instance_path, 'samples'))
except OSError:
    pass
try:
    os.makedirs(os.path.join(app.instance_path, 'samples'))
except OSError as e:
    print(e)

    

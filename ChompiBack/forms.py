from flask_wtf import FlaskForm
from wtforms import MultipleFileField, FileField
import wtforms_json

wtforms_json.init()

class UploadForm(FlaskForm):
    samples = MultipleFileField()

class ExportForm(FlaskForm):
    export_path = FileField()
from flask_wtf import FlaskForm
from wtforms import MultipleFileField


class UploadForm(FlaskForm):
    samples = MultipleFileField()


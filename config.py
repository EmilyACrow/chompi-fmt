import os

# TODO set up secret key properly, not this hacky junk
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
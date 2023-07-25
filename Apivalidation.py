from werkzeug.exceptions import HTTPException
from flask import make_response
import json

class NotFoundError(HTTPException):
    def __init__(self,status_code):
        self.response = make_response ('', status_code)

class ValidationError(HTTPException):
    def __init__(self,status_code,error_code,error_message):
        error_message={"error code":error_code, "error message":error_message}
        self.response=make_response(json.dumps(error_message),status_code)
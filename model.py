import random
import string
from flask_sqlalchemy.model import Model
from itsdangerous import BadSignature, Serializer, SignatureExpired
from database import db
from flask_security import RoleMixin
from flask_login import UserMixin
# from app import login_manager

secret_key=''.join(random.choice(string.ascii_uppercase+string.digits) for x in range(32))
def get_user(user_id):
    user = Username.query.filter_by(uid=user_id).first()
    return user

class Username(db.Model, UserMixin):
    __tablename__='username'
    uid= db.Column(db.Integer, autoincrement=True, primary_key=True)
    username= db.Column(db.String, unique=True, nullable=False)
    password=db.Column(db.String, nullable=False)
    fs_uniquifier = db.Column(db.String(255), unique=True) 
    email=db.Column(db.String, nullable=False)
    webhook=db.Column(db.String, nullable=False)
    report_option=db.Column(db.String, nullable=False)
    tid=db.relationship("Tracker", secondary="user_tracker")

    def get_id(self):
        return str(self.uid)

    def generate_auth_token(self,expiration=600):
        s=Serializer(secret_key)
        return s.dumps({'id':self.uid})

    @staticmethod
    def verify_auth_token(token):
        s=Serializer(secret_key)
        try:
            data=s.loads(token)
        except SignatureExpired:
            # Valid token, but expired
            return None
        except BadSignature:
            # Invalid Token
            return None
        id=data['id']
        return id
class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

# @login_manager.user_loader
# def load_user(id):
#     return Username.query.get(id)

class Tracker(db.Model):
    __tablename__="Tracker"
    id = db.Column(db.Integer(),autoincrement=True, primary_key=True)
    tracker_name = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(255), nullable=True)
    tracker_type = db.Column(db.String(255), nullable=True)
    time=db.Column(db.String)
    value=db.Column(db.String)
    uid=db.relationship("Username", secondary="user_tracker")

class User_Tracker(db.Model):
    __tablename__='user_tracker'
    ut_id= db.Column(db.Integer, autoincrement=True, primary_key=True)
    uid= db.Column(db.Integer, db.ForeignKey("username.uid"), nullable=False)
    tid=db.Column(db.Integer, db.ForeignKey("Tracker.id") , nullable=False)

class Logging(db.Model):
    __tablename__="logging"
    log_id= db.Column(db.Integer, autoincrement=True, primary_key=True)
    timestamp = db.Column(db.String(255), nullable=False)
    value = db.Column(db.String(255), nullable=False)
    note = db.Column(db.String(255), nullable=False)
    tid=db.Column(db.Integer, nullable=False)

class Tracker_Log(db.Model):
    __tablename__="tracker_log"
    tl_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    tid =db.Column(db.Integer, db.ForeignKey("Tracker.id") , nullable=False)
    lid = db.Column(db.Integer, db.ForeignKey("Logging.log_id") , nullable=False)

class Tracker_Type(db.Model):
    __tablename__="tracker_type"
    id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    tid=db.Column(db.Integer, nullable=False)
    choice=db.Column(db.String)
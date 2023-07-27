from flask_restful import Resource
from flask_restful import fields, marshal_with
from flask_restful import reqparse
from flask_login.utils import login_required
from flask_login import current_user,login_user,logout_user
from flask import make_response
# from flask_security import auth_required, current_user
from database import db
import json
from cache_initialize import cache
# from flask import current_app as app
from model import Username,Tracker,User_Tracker,Logging,Tracker_Log,Tracker_Type
from Apivalidation import NotFoundError,ValidationError

user_output_fields={
    "uid" : fields.Integer,
    "username": fields.String,
    "password" : fields.String
}

tracker_output_fields={
    "id" :fields.Integer,
    "tracker_name": fields.String,
    "description": fields.String,
    "tracker_type": fields.String,
    "time": fields.String,
    "value": fields.String,
    "uid": fields.String
}

log_output_fields={
	"log_id":fields.Integer,
	"timestamp": fields.String,
	"value": fields.String,
	"note": fields.String,
	"tid": fields.Integer
}

tracker_type_output_fields={
    "id":fields.Integer,
    "tid":fields.Integer,
    "choice":fields.String
}

create_user_parser=reqparse.RequestParser()
create_user_parser.add_argument('username')
create_user_parser.add_argument('password')
create_user_parser.add_argument('email')
create_user_parser.add_argument('webhook')
create_user_parser.add_argument('report_option')

create_tracker_parser=reqparse.RequestParser()
create_tracker_parser.add_argument('tracker_id')
create_tracker_parser.add_argument('tracker_name')
create_tracker_parser.add_argument('description')
create_tracker_parser.add_argument('tracker_type')
create_tracker_parser.add_argument('last_updated_time')
create_tracker_parser.add_argument('last_updated_value')
create_tracker_parser.add_argument('choices')

create_log_parser=reqparse.RequestParser()
create_log_parser.add_argument('log_id')
create_log_parser.add_argument('timestamp')
create_log_parser.add_argument('value')
create_log_parser.add_argument('note')
create_log_parser.add_argument('tid')

class UserAPi(Resource):

    def get(self,username,password):
        user=db.session.query(Username).filter(Username.username==username).first()
        if user is None:
            raise NotFoundError(status_code=400)
        passw=user.password
        if passw!=password:
            raise ValidationError(status_code=400,error_code="USER001",error_message="Invalid Password")
        login_user(user)
        return "Login Successful",200
    
    @marshal_with(user_output_fields)
    def post(self):
        args=create_user_parser.parse_args()
        username=args.get('username')
        password=args.get('password')
        email=args.get('email')
        webhook=args.get('webhook')
        report_option=args.get('report_option')

        user=db.session.query(Username).filter_by(username=username).first()
        if user is not None:
            return "Username already Taken",401

        new_user=Username(username=username,password=password,email=email,webhook=webhook,report_option=report_option)
        db.session.add(new_user)
        db.session.commit()
        return new_user

class LogoutAPI(Resource):
    @login_required
    def get(self):
        logout_user()
        return "Logout Successful",200

class TrackerAPI(Resource):

    @marshal_with(tracker_output_fields)
    @cache.memoize(86400)
    @login_required
    def get(self):
        user=current_user
        print(user.uid)
        track=db.session.query(User_Tracker).filter_by(uid=user.uid).all()
        if track==[]:
            raise NotFoundError(status_code=404)
        tid=[]
        for i in track:
            tid.append(i.tid)
        tracker=[]
        for i in tid:
            tracker.append(db.session.query(Tracker).filter_by(id=i).first())
        return tracker

    @marshal_with(tracker_output_fields)
    @login_required
    def post(self):
        args=create_tracker_parser.parse_args()
        tracker_name=args.get("tracker_name")
        description=args.get("description")
        tracker_type=args.get("tracker_type")
        choices=args.get("choices")
        # print(choices)

        if tracker_name is None:
            raise ValidationError(status_code=400,error_code="TRACKER001",error_message="Tracker Name is required and should be string")
        if description is None:
            raise ValidationError(status_code=400,error_code="TRACKER002",error_message="Tracker description is required and should be string")
        if tracker_type is None:
            raise ValidationError(status_code=400,error_code="TRACKER003",error_message="Tracker type is required and should be string")
        new_tracker=Tracker(tracker_name=tracker_name,description=description,tracker_type=tracker_type)
        # cache.delete_memoized(TrackerAPI.get)

        db.session.add(new_tracker)
        db.session.commit()

        if tracker_type=="Multiple Choice":
            choice=choices.strip().split("\n")
            for i in choice:
                new_choice=Tracker_Type(tid=new_tracker.id,choice=i)
                db.session.add(new_choice)
                db.session.commit()

        user=current_user
        new_ut=User_Tracker(uid=user.uid,tid=new_tracker.id)
        db.session.add(new_ut)
        db.session.commit()
        cache.delete_memoized(TrackerAPI.get,id)
        return new_tracker

    @marshal_with(tracker_output_fields)
    @login_required
    def put(self,id):
        args=create_tracker_parser.parse_args()
        tracker_name=args.get("tracker_name")
        description=args.get("description")
        tracker_type=args.get("tracker_type")
        choices=args.get("choices")

        if tracker_name is None:
            raise ValidationError(status_code=400,error_code="TRACKER001",error_message="Tracker Name is required and should be string")
        if description is None:
            raise ValidationError(status_code=400,error_code="TRACKER002",error_message="Tracker description is required and should be string")
        if tracker_type is None:
            raise ValidationError(status_code=400,error_code="TRACKER003",error_message="Tracker type is required and should be string")

        tracker=db.session.query(Tracker).filter_by(id=id).first()
        tracker.tracker_name=tracker_name
        tracker.description=description
        tracker.tracker_type=tracker_type
        db.session.commit()

        if tracker_type=="Multiple Choice":
            ttype=db.session.query(Tracker_Type).filter_by(tid=id).all()
            ids=[]
            for i in ttype:
                db.session.delete(i)
                db.session.commit()

            # db.session.delete(ttype)
            # db.session.commit()
            choices=choices.strip().split("\n")
            for i in choices:
                new_choice=Tracker_Type(tid=id,choice=i)
                db.session.add(new_choice)
                db.session.commit()
        cache.delete_memoized(TrackerAPI.get,id)
        return "Tracker Edit Successful",200





    @login_required
    def delete(self,id):
        ut=db.session.query(User_Tracker).filter_by(tid=id).first()
        print(ut)
        if ut is None:
            raise NotFoundError(status_code=404)
        tracker=db.session.query(Tracker).filter_by(id=id).first()
        if tracker is None:
            raise NotFoundError(status_code=404)
        if tracker.tracker_type=="Multiple Choice":
            ttype=db.session.query(Tracker_Type).filter_by(tid=id).all()
            for i in ttype:
                db.session.delete(i)
        cache.delete_memoized(TrackerAPI.get,id)
        db.session.delete(ut)
        db.session.delete(tracker)
        db.session.commit()
        return "Tracker Successfully Deleted",200

class TrackerTypeAPI(Resource):
    @marshal_with(tracker_type_output_fields)
    @login_required
    def get(self,id):
        choice=db.session.query(Tracker_Type).filter_by(tid=id).all()
        if choice is None:
            raise NotFoundError(status_code=404)
        choices=[]
        for i in choice:
            choices.append(i)
        return choices


class LogAPI(Resource):

    @marshal_with(log_output_fields)
    @cache.memoize(86400)
    @login_required
    def get(self,id):
        log=db.session.query(Logging).filter_by(tid=id).all()
        if log==[]:
            raise NotFoundError(status_code=404)
        return log

    @marshal_with(log_output_fields)
    @login_required
    def post(self,id):
        args=create_log_parser.parse_args()
        # tid=args.get("tid")
        timestamp=args.get("timestamp")
        value=args.get("value")
        note=args.get("note")
        print(timestamp)
        if timestamp is None:
            raise ValidationError(status_code=400,error_code="LOG001",error_message="TimeStamp is required and should be string")
        if value is None:
            raise ValidationError(status_code=400,error_code="LOG002",error_message="Value is required and should be string")
        if note is None:
            raise ValidationError(status_code=400,error_code="LOG003",error_message="Note is required and should be string")
        new_log=Logging(timestamp=timestamp,value=value,note=note,tid=id)
        cache.delete_memoized(LogAPI.get,id)
        db.session.add(new_log)
        db.session.commit()
        tracker=db.session.query(Tracker).filter_by(id=id).first()
        tracker.time=timestamp
        tracker.value=value
        db.session.commit()
        return new_log
	
    @login_required	
    def put(self,id):
        args=create_log_parser.parse_args()
        timestamp=args.get("timestamp")
        value=args.get("value")
        note=args.get("note")
        if timestamp is None:
            raise ValidationError(status_code=400,error_code="LOG001",error_message="TimeStamp is required and should be string")
        if value is None:
            raise ValidationError(status_code=400,error_code="LOG002",error_message="Value is required and should be string")
        if note is None:
            raise ValidationError(status_code=400,error_code="LOG003",error_message="Note is required and should be string")
        log=db.session.query(Logging).filter_by(log_id=id).first()
        cache.delete_memoized(LogAPI.get,id)
        log.timestamp=timestamp
        log.value=value
        log.note=note
        db.session.commit()
        tracker=db.session.query(Tracker).filter_by(id=log.tid).first()
        tracker.time=timestamp
        tracker.value=value
        db.session.commit()
        return "Log Editted Successfully",200

    @login_required
    def delete(self,id):
        log=db.session.query(Logging).filter_by(log_id=id).first()
        if log is None:
            raise NotFoundError(status_code=404)
        print("Done")
        cache.delete_memoized(LogAPI.get,id)
        db.session.delete(log)
        db.session.commit()
        return "Log deleted Successfully",200

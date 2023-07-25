from flask_restful import Resource
from flask_restful import fields, marshal_with
from flask_restful import reqparse
from flask_login.utils import login_required
from flask_login import current_user
from database import db
from cache_initialize import cache
# from flask import current_app as app
from model import Username,Tracker,User_Tracker,Logging,Tracker_Log,Tracker_Type
from Apivalidation import NotFoundError,ValidationError

user_output_fields={
    "user_id" : fields.Integer,
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

create_tracker_parser=reqparse.RequestParser()
create_tracker_parser.add_argument('tracker_id')
create_tracker_parser.add_argument('tracker_name')
create_tracker_parser.add_argument('description')
create_tracker_parser.add_argument('tracker_type')
create_tracker_parser.add_argument('last_updated_time')
create_tracker_parser.add_argument('last_updated_value')

create_log_parser=reqparse.RequestParser()
create_log_parser.add_argument('log_id')
create_log_parser.add_argument('timestamp')
create_log_parser.add_argument('value')
create_log_parser.add_argument('note')
create_log_parser.add_argument('tid')

# class UserAPi(Resource):
#     def get(self,username,password):
#         user=db.session.query(Username).filter(Username.username==username).first()
#         if user is None:
#             raise NotFoundError(status_code=404)
#         passw=user.password
#         if passw!=password:
#             raise ValidationError(status_code=400,error_code="USER001",error_message="Invalid Password")
#         return "",200
    
#     @marshal_with(user_output_fields)
#     def post(self,username,password):
#         new_user=Username(username=username,password=password)
#         db.session.add(new_user)
#         db.session.commit()
#         return new_user

# class TrackerAPI(Resource):

#     @marshal_with(tracker_output_fields)
#     @login_required
#     def get(self):
#         user=current_user
#         print(user.uid)
#         track=db.session.query(User_Tracker).filter_by(uid=user.uid).all()
#         if track==[]:
#             raise NotFoundError(status_code=404)
#         tid=[]
#         for i in track:
#             tid.append(i.tid)
#         tracker=[]
#         for i in tid:
#             tracker.append(db.session.query(Tracker).filter_by(id=i).first())
#         return tracker

#     @marshal_with(tracker_output_fields)
#     @login_required
#     def post(self):
#         args=create_tracker_parser.parse_args()
#         tracker_name=args.get("tracker_name")
#         description=args.get("description")
#         tracker_type=args.get("tracker_type")

#         if tracker_name is None:
#             raise ValidationError(status_code=400,error_code="TRACKER001",error_message="Tracker Name is required and should be string")
#         if description is None:
#             raise ValidationError(status_code=400,error_code="TRACKER002",error_message="Tracker description is required and should be string")
#         if tracker_type is None:
#             raise ValidationError(status_code=400,error_code="TRACKER003",error_message="Tracker type is required and should be string")
#         new_tracker=Tracker(tracker_name=tracker_name,description=description,tracker_type=tracker_type)
#         # cache.delete_memoized(TrackerAPI.get)
#         db.session.add(new_deck)
#         db.session.commit()
#         return new_tracker

#     @login_required
#     def delete(self,tracker_id):
#         tracker=db.session.query(Tracker).filter_by(id=tracker_id).first()
#         if tracker in None:
#             raise NotFoundError(status_code=404)
#         db.session.delete(tracker)
#         db.session.commit()
#         return "Tracker Successfully Deleted",200

class LogAPI(Resource):

    @marshal_with(log_output_fields)
    @cache.memoize(86400)
    def get(self,id):
        log=db.session.query(Logging).filter_by(tid=id).all()
        if log==[]:
            raise NotFoundError(status_code=404)
        return log

    @marshal_with(log_output_fields)
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
        return new_log
		
    def delete(self,id):
        log=db.session.query(Logging).filter_by(log_id=id).first()
        if log is None:
            raise NotFoundError(status_code=404)
        print("Done")
        cache.delete_memoized(LogAPI.get,id)
        db.session.delete(log)
        db.session.commit()
        return "Log deleted Successfully",200

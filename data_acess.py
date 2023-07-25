from model import Username,Tracker,Logging,User_Tracker
from database import db
from app import cache

@cache.memoize(43200)
def get_user_tracker(user_id):
	track_id=db.session.query(User_Tracker).filter_by(uid=user_id).all()
	tid=[]
	for i in track_id:
		tid.append(i.tid)
	tracker=[]
	for i in tid:
		track=db.session.query(Tracker).filter_by(id=i).first()
		tracker.append(track)
	return tracker

@cache.memoize(43200)
def get_tracker_log(track_id):
	# tracker=db.session.query(Tracker).filter_by(id=id).first()
	log=db.session.query(Logging).filter_by(tid=track_id).all()
	return log
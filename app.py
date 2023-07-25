from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource,Api
from config import LocalDevelopmentConfig
from flask_login import LoginManager
from model import Username
# from flask_security import Security, SQLAlchemySessionUserDatastore
import worker
from database import db
from flask_caching import Cache
from cache_initialize import cache
# from celery import Celery



app=None
celery=None
# cache=None
app=Flask(__name__, template_folder='templates')

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.sqlite3"
app.config['SECRET_KEY']="thisisasecretkey"
# app.config["CELERY_BROKER_URL"]="redis://localhost:6379/1"
# app.config["CELERY_RESULT_BACKEND"]=="redis://localhost:6379/2"
db=SQLAlchemy()
db.init_app(app)
app.config.from_object(LocalDevelopmentConfig)
app.app_context().push()
# user_datastore = SQLAlchemySessionUserDatastore(db.session, Username, Role)
# security = Security(app, user_datastore)

celery=worker.celery
# celery=Celery(app.name, broker=app.config["CELERY_BROKER_URL"])
# celery.conf.update(app.config)
celery.conf.update(
    broker_url=app.config["CELERY_BROKER_URL"],
    result_backend=app.config["CELERY_RESULT_BACKEND"],
    timezone="Asia/Kolkata"
    )
celery.Task=worker.ContextTask
app.app_context().push()


# APIs
api=Api(app)
# app.app_context().push()

from api import LogAPI
api.add_resource(LogAPI,"/api/log/<int:id>")


# cache initialization
cache.init_app(app)


login_manager=LoginManager()
login_manager.init_app(app)
login_manager.login_view='login'

@login_manager.user_loader
def load_user(user_id):
    return Username.query.get(int(user_id))


# @app.route("/", methods=["GET","POST"])
# def login():
#     if request.method=="GET":
#         print("hello")
#         return render_template("login.html")

from validation import *
if __name__=="__main__":
    app.run()
    app.debug=True
    app.tread=False
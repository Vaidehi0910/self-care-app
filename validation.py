# from crypt import methods
import flask
from flask import Flask, jsonify, request, flash, send_from_directory
from flask import render_template,send_file
from flask import current_app as app
from flask.helpers import url_for
from flask_login import login_user,current_user
from flask_login.utils import login_required, login_user, logout_user
from sqlalchemy.orm import session
from werkzeug.utils import redirect
from werkzeug.utils import secure_filename
from database import db
from model import Username,Tracker,User_Tracker,Logging,Tracker_Log,Tracker_Type
from flask_security import UserMixin
# from flask_jwt_extended import jwt_required, create_access_token
from datetime import datetime,timezone
import requests
import pytz
import json
import tasks
import asyncio
import os
# import matplotlib
# matplotlib.use("Qt5Agg")
import matplotlib.pyplot as plt
import numpy
from worker import celery
from jinja2 import Template
from weasyprint import HTML
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import data_acess
from app import cache
import csv
# from sqlalchemy.orm import sessionmaker



# @app.route('/token')
# @login_required
# def get_auth_token():
#     token=user.generate_auth_token()
#     return jsonify({'token':token.decode('ascii')})

# @verify_password
def verify_password(username_or_token, password):
    user_id=Username.verify_auth_token(username_or_token)
    if user_id:
        user=session.query(Username).filter_by(id=user_id).one()
    else:
        user=session.query(Username).filter_by(username=username_or_token).first()

# ========================================================================================================================================
#                                                   Login
# ========================================================================================================================================

@app.route("/login", methods=["GET","POST"])
def login():
    error=None
    if request.method=="GET":
        return render_template("dashboard.html")
    if request.method=="POST":
        uname=request.form["username"]
        pas= request.form["password"]
        if '"' in uname or "'" in uname:
            error="Enter a valid username"
            return redirect(url_for('login'))
        if '"' in pas or "'" in pas:
            error="Enter a valid password"
            return render_template("login.html",error=error)
        user=db.session.query(Username).filter(Username.username==uname).first()
        if user is None:
            return render_template("signUp.html")
        passw=user.password
        # if name is None:
        #     return render_template("sign-in.html")
        if pas!=passw:
            error="invalid password"
            return render_template("login.html",error=error)
        # if user:
        #     access_token = create_access_token(identity=uname)
        login_user(user)
        return redirect(url_for('dash'))

# ========================================================================================================================================
#                                                   logout
# ========================================================================================================================================

@app.route("/logout",methods=["GET"])
@login_required
def logout():
    if request.method=="GET":
        msg="You have Been Successfully logged out"
        logout_user()
        return render_template("login.html",error=msg)

# ========================================================================================================================================
#                                                   Dashboard
# ========================================================================================================================================
@app.route("/",methods=["GET","POST"])
@login_required
def dash():
    if request.method=="GET":
        user=current_user
        # print(user.uid)
        tracker=data_acess.get_user_tracker(user.uid)
        
        return render_template("dashboard.html",tracker=tracker)

# ========================================================================================================================================
#                                                   Monthly Report Option
# ========================================================================================================================================

@app.route("/report-format",methods=["GET","POST"])
@login_required
def report_format():
    if request.method=="GET":
        return render_template("report_format.html")
    if request.method=="POST":
        option=request.form.get("format")
        user=current_user
        user.report_option=option
        db.session.commit()
        return redirect("http://127.0.0.1:5000/#/dash")


# ========================================================================================================================================
#                                                   TrendLine
# ========================================================================================================================================

@app.route("/trendline/<int:id>",methods=["GET","POST"])
@login_required
def trendline(id):
    user=current_user
    track=db.session.query(Tracker).filter_by(id=id).first()
    # track_id=db.session.query(User_Tracker).filter_by(uid=user.uid).all()
    log=db.session.query(Logging).filter_by(tid=id).all()
    val=[]
    time=[]
    y=[]
    if track.tracker_type=="Numerical":
        for i in log:
            val.append(float(i.value))
            time.append(i.timestamp)
        # fig = plt.figure()
        # fig.set_figwidth(10)
        # fig.set_figheight(5)
        # plt.rcParams["figure.figsize"] = (10,10)
            plt.plot(time,val)
        plt.xlabel("Time Stamp",fontsize=6)
        plt.ylabel("Value")
        plt.yticks(val)
        plt.xticks(time,fontsize=6)
        plt.gcf().autofmt_xdate()
        plt.show()
        # filename="trendline"+str(id)
        # plt.savefig(filename)

    if track.tracker_type=="Time Duration":
        for i in log:
            time.append(i.timestamp)
            hr=int(i.value.split(":")[0])
            mi=int(i.value.split(":")[1])
            t=hr*60+mi
            val.append(float(t))
            y.append(float(t))
            plt.plot(time,val)
        plt.xlabel("Time Stamp",fontsize=6)
        plt.ylabel("Value")
        plt.yticks(y)
        plt.xticks(time,rotation=30,fontsize=6)
        plt.plot(val,'o:y',linestyle="--")
        # plt.figure().autofmt_xdate()
        plt.show()
        # filename="trendline"+str(id)
        # plt.savefig(filename,bbox_inches='tight')

        # plt.savefig('trendline.png')
    if track.tracker_type=="Boolean":
        true=0
        false=0
        for i in log:
            if i.value=="True":
                true+=1
            if i.value=="False":
                false+=1
            time.append(i.timestamp)
        xval=["True","False"]
        val.append(true)
        val.append(false)
        # print(val)
        plt.ylabel("Frequency")
        plt.bar(xval,val,color='yellowgreen',width=0.4)
        plt.show()
        # filename="trendline"+str(id)
        # plt.savefig(filename,bbox_inches='tight')

    if track.tracker_type=="Multiple Choice":
        ttype=db.session.query(Tracker_Type).filter_by(tid=id)
        choice={}
        for i in ttype:
            if i.choice not in choice:
                choice[i.choice.rstrip()]=0
        # print(choice)
        for i in log:
            x=i.value.rstrip()
            choice[i.value.rstrip()]+=1
        xval=list(choice.keys())
        val=list(choice.values())
        # plt.figure().tight_layout()
        plt.xticks(rotation=30,fontsize=6)
        plt.ylabel("Frequency")
        plt.bar(xval,val,color='yellowgreen',width=0.4)
        plt.show()
        # filename="trendline"+str(id)
        # plt.savefig(filename,bbox_inches='tight')

    # return render_template("trendline.html",tracker=track)

    return redirect("http://127.0.0.1:5000/#/dash")

# ========================================================================================================================================
#                                                   Statistics
# ========================================================================================================================================

@app.route('/stats/<int:id>',methods=["GET"])
@login_required
def stats(id):
    track=db.session.query(Tracker).filter_by(id=id).first()
    log=db.session.query(Logging).filter_by(tid=id).all()
    val=[]
    sum=0
    if track.tracker_type=="Numerical":
        for i in log:
            val.append(float(i.value))
            sum+=float(i.value)
        maxi=max(val)
        mini=min(val)
        n=len(val)
        avg=round(sum/n,2)
        return render_template("stats.html",max=maxi,min=mini,avg=avg,tracker=track)
    if track.tracker_type=="Time Duration":
        s=0
        for i in log:
            hr=int(i.value.split(":")[0])
            mi=int(i.value.split(":")[1])
            t=hr*60+mi
            val.append(float(t))
            sum+=t
        ma=max(val)
        mi=min(val)
        if ma>59:
            max_hr=ma//60
            max_min=ma%60
        else:
            max_hr=0
            max_min=ma
        if mi>59:
            min_hr=mi//60
            min_min=mi%60,2
        else:
            min_hr=0
            min_min=mi
        maxi=[max_hr,max_min]
        mini=[min_hr,min_min]
        n=len(val)
        a=round(sum/n,2)
        # print(a)
        avg_hr=a//60
        avg_min=round(a%60,2)
        avg=[avg_hr,avg_min]
        return render_template("stats.html",max=maxi,min=mini,avg=avg,tracker=track)

    if track.tracker_type=="Boolean":
        true=0
        false=0
        for i in log:
            if i.value=="True":
                true+=1
            if i.value=="False":
                false+=1
        return render_template("stats.html",true_count=true,false_count=false,tracker=track)

    if track.tracker_type=="Multiple Choice":
        ttype=db.session.query(Tracker_Type).filter_by(tid=id)
        choice={}
        for i in ttype:
            if i.choice not in choice:
                choice[i.choice.rstrip()]=0
        # print(choice)
        for i in log:
            x=i.value.rstrip()
            choice[i.value.rstrip()]+=1
        # print(choice)
        max_key=[]
        min_key=[]
        max_val=max(choice.values())
        min_val=min(choice.values())
        for key,value in choice.items():
            if value==max_val:
                max_key.append(key)
            if value==min_val:
                min_key.append(key)
        
        return render_template("stats.html",max_key=max_key,min_key=min_key,max_val=max_val,min_val=min_val,tracker=track)

        

# ========================================================================================================================================
#                                                   Exporting tracker to csv
# ========================================================================================================================================



@app.route("/export/tracker",methods=["GET","POST"])
@login_required
def exportTracker():
    header=['Tracker_id','Tracker_name','Description','Tracker_Type']
    # track=data_acess.get_user_tracker(current_user.uid)
    # tracker=[]
    # for i in json.loads(track):
    #     l=[i.id,i.tracker_name,i.description,i.tracker_type]
    #     tracker.append(i)
    ut=db.session.query(User_Tracker).filter_by(uid=current_user.uid).all()
    tid=[]
    for i in ut:
        tid.append(i.tid)
    tracker=[]
    for i in tid:
        track=db.session.query(Tracker).filter_by(id=i).first()
        l=[track.id,track.tracker_name,track.description,track.tracker_type]
        tracker.append(l)
    name="trackers.csv"
    # with app.test_request_context('/export/tracker'):
    job=tasks.create_csv.delay(header,tracker,name)

    return send_file("exportedFiles/trackers.csv")

# ========================================================================================================================================
#                                                   Exporting logs to csv
# ========================================================================================================================================

@app.route('/export/log/<int:id>',methods=["GET","POST"])
@login_required
def exportLog(id):
    header=['timestamp','value','note','Tracker_id']
    logs=data_acess.get_tracker_log(id)
    log=[]
    for i in logs:
        log.append([i.timestamp,i.value,i.note,i.tid])
    name="Tracker"+str(id)+"log.csv"
    # with app.test_request_context('/export/tracker'):
    job=tasks.create_csv.delay(header,log,name)
    job.wait()

    return send_from_directory('exportedFiles',name)
    
    
    # return redirect(url_for('logging',id=id))

def callFlash(filename,name):
    return send_from_directory(filename,name)

# ========================================================================================================================================
#                                                   Uploading CSV
# ========================================================================================================================================

Allowed_extension=set(['csv'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Allowed_extension

@app.route("/upload/<int:id>",methods=["GET","POST"])
def upload(id):
    if request.method=="GET":
        return render_template("upload.html",id=id)
    if request.method=="POST":
        # print("hello")
        file=request.files['file']
        print(file.filename)
        if file and allowed_file(file.filename):
            print("hello")
            # remove slashes from the file
            filename=secure_filename(file.filename)
            save_location =  os.path.join('input', filename)
            file.save(save_location)
            result=process_file(save_location,id)
            if result=="error":
                return "Header names are not matching. Please send the csv in correct format"
            else:
                return redirect("http://127.0.0.1:5000/#/dash")
        else:
            return "File Extension Not Correct. Please Upload CSV file only"
    
def process_file(filename,id):
    with open(filename,'r') as file:
        cache.delete_memoized(data_acess.get_tracker_log,id)
        reader=csv.DictReader(file)
        try:
            for row in reader:
                tid=row["Tracker_id"]
                time=row["timestamp"]
                value=row["value"]
                note=row["note"]
                new_log=Logging(timestamp=time,value=value,note=note,tid=tid)
                db.session.add(new_log)
            db.session.commit()
        except:
            db.session.rollback()
            return "error"
        return "Successful"

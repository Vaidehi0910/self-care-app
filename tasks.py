from worker import celery
import csv
import os
import requests
from flask import send_from_directory,url_for,flash,send_file,jsonify
from flask import current_app as app
from werkzeug.utils import redirect
from celery.schedules import crontab
from database import db
from model import User_Tracker, Tracker, Logging,Username
from jinja2 import Template
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from weasyprint import HTML
from json import dumps
from httplib2 import Http
from datetime import date


BASE="http://127.0.0.1:5000"





# =========================================================================================================================================
#                                                   Daily Reminder
# =========================================================================================================================================
@celery.on_after_finalize.connect
def send_daily_alert(sender, **kwargs):
    sender.add_periodic_task(crontab(minute=3, hour=8),daily_alert.s(),name="daily alert")
    # sender.add_periodic_task(10.0,daily_alert.s(),name="montly progress")

@celery.task()
def daily_alert():

    user=db.session.query(Username).all()
    for u in user:
        flag=False
        ut=db.session.query(User_Tracker).filter_by(uid=u.uid).all()
        tid=[]
        tracker=[]
        for i in ut:
            tid.append(i.tid)
        for i in tid:
            log=db.session.query(Logging).filter_by(tid=i).all()
            searchlog=log[-1]

            today=str(date.today())
            if today in searchlog.timestamp:
                flag=True
        if flag==False:
            message="You have not done any activity today. Please do. If done please add log"
            url=str(u.webhook)
            alert_message={'text':message}
            message_headers={'Content-Type':'application/json; charset=UTF-8'}
            http_obj=Http()
            r=http_obj.request(uri=url,method='POST',headers=message_headers,body=dumps(alert_message))
    # print(r)

# =========================================================================================================================================
#                                                   Export CSV
# =========================================================================================================================================
@celery.task()
def create_csv(header,data,name):

    with open(os.path.join('exportedFiles', name),'w',encoding='UTF8', newline='') as file:
        writer=csv.writer(file)
        writer.writerow(header)
        writer.writerows(data)
        
    # sendcsv()

    # requests.get("http://127.0.0.1:5000/send-csv")
    # file.close()
    # print("hello")
    # http_obj=Http()
    # r=http_obj.request(uri="http://127.0.0.1:5000/send-csv")
    # print(r)
    # send_file('exportedFiles/trackers.csv',mimetype='text/csv',as_attachment=True)
    # flash("CSV Exported Successfully",category="info")
    # requests.get(BASE+'/send-csv-file')
    # return "CSV Exported Successfully"
    # with app().app_context():
    #     return redirect(url_for('dash'))
    # with app.test_request_context('/export/tracker'):
    #     return redirect(url_for('dash'))
    # return redirect(url_for('dash'))
    # request.get("/export/tracker")

# def sendcsv():
#     print("hlo")
#     return send_file("exportedFiles/trackers.csv")

# ==========================================================================================================================================
                                                    # Sending Email
# ==========================================================================================================================================
@celery.on_after_finalize.connect
def send_monthly_progress(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=15, minute=45, day_of_month='24'),send_email.s(),name="montly progress")
    # sender.add_periodic_task(10.0,send_email.s(),name="montly progress")


@celery.task()
def send_email():
    user=db.session.query(Username).all()
    for u in user:
        ut=db.session.query(User_Tracker).filter_by(uid=u.uid).all()
        tid=[]
        tracker=[]
        for i in ut:
            tid.append(i.tid)

        for i in tid:
            log=db.session.query(Logging).filter_by(tid=i).all()
            tracker=db.session.query(Tracker).filter_by(id=i).first()
            # message=format_message("")
            name="Monthly Report for "+tracker.tracker_name
            if len(log)>30:
                message=format_message("monthlyReport.html",data=log[-30])
            else:
                message=format_message("monthlyReport.html",data=log)
            if u.report_option=="PDF":
                create_pdf_report(name,message)
                send_mail(u.email,subject=name,message="Your Monthy Report of "+tracker.tracker_name+" is in PDF",attachment_file=str(name)+".pdf")
            else:
               send_mail(u.email,subject=name,message=message) 

def send_mail(to_address, subject, message,attachment_file=None):
    msg=MIMEMultipart()
    msg["From"] = "selfcare@QuantifiedSelfApp.com"
    msg["To"] = to_address
    msg["Subject"] = subject

    msg.attach(MIMEText(message,"html"))

    if attachment_file:
        with open(attachment_file,"rb") as attachment:
            part=MIMEBase("application","octet-stream")
            part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",f"attachment; filename= {attachment_file}"
            )
        msg.attach(part)

    s=smtplib.SMTP(host="localhost",port="1025")
    s.login("email@selfcareapp.com","")
    s.send_message(msg)
    s.quit()
    return True

def format_message(template_file,data={}):
    with open(template_file) as file:
        template=Template(file.read())
        return template.render(data=data)

def create_pdf_report(name,message):
    html=HTML(string=message)
    file_name=name+".pdf"
    html.write_pdf(target=file_name)

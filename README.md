# Self Care App
This is a responsive web application which will help you to take care of yourself by sending monthly reports and daily reminders. The daily reminders and monthly report are two scheduled tasks that are implemented using celery.\
If the user forgets to add aany log in any of their tracker then at 11.35pm a remainder message will be send to the user to add log.
<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/e6b42d13-37d7-4c57-a238-3a646d442374" alt="Daily Reminder" width="" height="">\
At 1st of every month, the reports of the month will be emailed to the user in the format specified by the user. 
<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/6c4bcb5d-5022-4614-a08a-4768a61601d5" alt="Emails" width="" height="">

## Quick go-through of the app.
### Sign up and Login Page
The user needs to sign up using username, email id, webhook url( to send daily reminder if the user has not updated and of the trackers), monthly report format and password. After singing up the user can login.
Login is cookie-based authenticated and error will be catched, if any.
<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/b5a9fce7-c5c0-453a-82eb-c58572f61925" alt="Sign-up Page" width="800" height="400">
<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/fa5a6692-a4f4-4509-8138-daa8936aa76d" alt="Login Page" width="800" height="300">

### Home Page
In dashboard, data is user specific and is loading using lifecycle hook of vue. CRUD operations are implemented. APIs are used to extract data with caching of data with cache expiry for smooth user experience.\
The export button create a csv file, containing different tracker details, that is downloaded on the local machine as asynchronous job using celery.\
On the top right hand side there is a button to change report format from html to pdf or vce-versa.\
Different colors are given to trackers to denote different tracker types.\
The Card shows id of the tracker, Tracker name, type, last updated time and value. 
<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/254a66fe-f5b3-4c17-933d-05ba0c450989" alt="Dashboard">

### Create Tracker
New tracker can be created by using tracker name, tracket type, i.e. numerical, multi choice, boolean and time duration, and description. If the tracker is multi choice, then different choices are created by the user and the user can create any number of choices according to thier will.
<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/53ecec43-b3f7-4c3b-a1b5-9659c4fb80a2" alt="Create Tracker">

### Add Log
The timestamp in add log is automatic and editable. The value is according to the tracker type. If the tracker type is numerical, only numerical values can be added, if multichoice, then there will a drop down with all the options created my the user and the user can select any one. In boolean, drop down with 2 values, true or false is there. For time duration, time can be selected as hours and minutes.
<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/7695734c-e289-4f14-86b7-277ba09faa11" alt="Add Log Page">

### View Log
In view log, CRUD operation is implemented. Export button is similar to the home page export button. The difference is this will export only the particular tracker data with logs. Through import we can add log using csv file with same parameters as there in export tracker. in Numerical and time duration, trendline is line graph and stats is min max and average. In multi-choice and boolean, trendline is bar graph and stats are count values. In multi-choice, maximum and minimum options used are also given. 

<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/608b50ae-9b55-4256-b4bb-d6674df73fd6" alt="View Log">
<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/327da306-4321-4689-8178-f3bc8aa1a7aa" alt="Numerical Stats" ">
<img  src="https://github.com/Vaidehi0910/self-care-app/assets/69051103/ad9e4ff8-e51b-4387-8b48-b749808713d1" alt="Multi-choice stats">

## Instructions to follow to run self care app on your local machine

step 1: open command prompt

step 2: Redirect it to the project folder's location  

step 3: Run command "py -m venv env" to create virtual environment in your local machine

step 4: Run the following command to enable virtual environment

			for windows: env/Scripts/activate
   
			for linux: /usr/bin/python3 env
   
step 5: Download and Install GTK3

step 6: Run command "pip install -r requirements.txt" 

step 7: For Windows OS install WSL. For more detail read documentation of WSL. For Linux and Mac OS, this step not needed

step 8: Open Ubuntu or Linux terminal.

step 9: Install redis using following steps. For more detail read documentation of redis.

		a) Run command "curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg"
  
		b) Run command "sudo apt-get update"
  
		c) Run command "sudo apt-get install redis"
  
step 10: Run command "sudo service redis-server start" to start redis server

step 11: Run command "redis-cli" to enter redis cli

step 12: You can install resp app to see the redis database, if needed.

step 13: Switch tab to command prompt.

step 14: Create 2 more command prompts and enable virtual environment in both of them

			In one command prompt Run command "celery -A app.celery worker --pool=solo -l info" to start celery
   
			In other command prompt Run command "celery  -A app.celery beat --max-interval 1 -l info" to start celery bash
   
step 15: In command prompt of step 2, Run "py app.py" and paste the link generated in your browser and enjoy the app.

step 16: Get your mailhog running to recieve the mail.

step 17: Get your google chat account ready to recieve daily alerts.


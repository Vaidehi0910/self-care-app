# self-care-app
web application which will help you to take care of yourself by sending monthly reports and daily reminders

Self Care App (project by 21f1003880)

Here are the instructions to follow to run self care app on your local machine

step 1: open command prompt
step 2: Redirect it to the project folder's location  
step 3: Run command "py -m venv env" to create virtual environment in your local machine
step 4: Run the following command to enable virtual environment
			for windows: env/Scripts/activate
			for linux: /usr/bin/python3 env
step 5: Download GTK3
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


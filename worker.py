from celery import Celery
from flask import current_app as app

celery=Celery('tasks')

class ContextTask(celery.Task):
	def __call__(self,*args,**kwargs):
		with app.test_request_context('/'):
			return self.run(*args, **kwargs)

# sudo service redis-server start
# redis-cli

# Celery start
# celery -A app.celery worker --pool=solo -l info

# celery beat
# celery  -A app.celery beat --max-interval 1 -l info
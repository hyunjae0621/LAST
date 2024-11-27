# backend/backend/celery.py
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('dance_academy')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# 스케줄 작업 등록
app.conf.beat_schedule = {
    'check-subscription-expiry': {
        'task': 'notifications.tasks.check_subscription_expiry',
        'schedule': crontab(hour=9, minute=0)  # 매일 오전 9시
    },
    'send-class-reminders': {
        'task': 'notifications.tasks.send_class_reminders',
        'schedule': crontab(minute='*/10')  # 10분마다
    },
}
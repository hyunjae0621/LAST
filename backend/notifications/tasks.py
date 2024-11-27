# backend/notifications/tasks.py
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
from subscriptions.models import Subscription
from classes.models import ClassSchedule
from attendance.models import Attendance
from .services import NotificationService
from celery.schedules import crontab
from backend.celery import app

@shared_task
async def check_subscription_expiry():
    """수강권 만료 예정 알림"""
    expiry_date = timezone.now().date() + timedelta(days=7)
    subscriptions = await Subscription.objects.filter(
        status='active',
        end_date=expiry_date
    ).select_related('student', 'dance_class').all()
    
    for subscription in subscriptions:
        await NotificationService.create_subscription_expiry_notification(subscription)

@shared_task
async def send_class_reminders():
    """수업 시작 알림"""
    now = timezone.now()
    today = now.date()
    
    # 오늘의 출석 기록 조회
    attendances = await Attendance.objects.filter(
        date=today,
        schedule__start_time__gte=now.time(),
        schedule__start_time__lte=(now + timedelta(minutes=30)).time(),
        status='pending'  # 아직 출석 체크가 안된 기록
    ).select_related(
        'student',
        'dance_class',
        'schedule'
    ).all()
    
    # 각 출석 기록에 대해 알림 전송
    for attendance in attendances:
        await NotificationService.create_class_reminder_notification(attendance)

# Celery Beat 스케줄 설정을 위한 업데이트
app.conf.beat_schedule = {
    'check-subscription-expiry': {
        'task': 'notifications.tasks.check_subscription_expiry',
        'schedule': crontab(hour=9, minute=0)  # 매일 오전 9시
    },
    'send-class-reminders': {
        'task': 'notifications.tasks.send_class_reminders',
        'schedule': crontab(minute='*/30')  # 30분마다
    },
}
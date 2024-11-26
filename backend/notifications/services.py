# backend/notifications/services.py

from django.core.mail import send_mail
from django.conf import settings
from .models import Notification

class NotificationService:
    @staticmethod
    async def create_notification(user, type, title, message, link=''):
        """알림 생성"""
        notification = await Notification.objects.acreate(
            user=user,
            type=type,
            title=title,
            message=message,
            link=link
        )
        
        # 사용자의 알림 설정 확인
        user_settings = await user.notification_settings.aget()
        
        # 이메일 알림이 활성화되어 있고, 해당 타입의 알림이 활성화된 경우
        if (user_settings.email_notification and 
            getattr(user_settings, type, True)):
            try:
                send_mail(
                    subject=title,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True
                )
            except Exception as e:
                print(f"Failed to send email: {str(e)}")

        return notification

    @staticmethod
    async def create_subscription_expiry_notification(subscription):
        """수강권 만료 알림 생성"""
        await NotificationService.create_notification(
            user=subscription.student,
            type='subscription_expiry',
            title='수강권 만료 예정',
            message=f'{subscription.dance_class.name} 수업의 수강권이 7일 후 만료됩니다.',
            link=f'/subscriptions/{subscription.id}'
        )

    @staticmethod
    async def create_class_reminder_notification(attendance):
        """수업 알림 생성"""
        await NotificationService.create_notification(
            user=attendance.student,
            type='class_reminder',
            title='수업 알림',
            message=f'오늘 {attendance.schedule.start_time.strftime("%H:%M")}에 {attendance.dance_class.name} 수업이 있습니다.',
            link=f'/classes/{attendance.dance_class.id}'
        )

    @staticmethod
    async def create_pause_status_notification(subscription, status):
        """일시정지 상태 변경 알림 생성"""
        message = (
            '일시정지가 승인되었습니다.' if status == 'paused'
            else '수강이 재개되었습니다.'
        )
        await NotificationService.create_notification(
            user=subscription.student,
            type='pause_status',
            title='일시정지 상태 변경',
            message=f'{subscription.dance_class.name} 수업의 {message}',
            link=f'/subscriptions/{subscription.id}'
        )

    @staticmethod
    async def create_makeup_status_notification(makeup_class, status):
        """보강 상태 변경 알림 생성"""
        message = {
            'approved': '보강 신청이 승인되었습니다.',
            'rejected': '보강 신청이 거절되었습니다.',
            'completed': '보강이 완료되었습니다.'
        }.get(status, '')

        await NotificationService.create_notification(
            user=makeup_class.student,
            type='makeup_status',
            title='보강 상태 변경',
            message=message,
            link=f'/makeup/{makeup_class.id}'
        )
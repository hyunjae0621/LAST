# backend/notifications/services/email_service.py
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

class EmailService:
    @staticmethod
    async def send_template_email(to_email, template_name, context, subject):
        """HTML 템플릿 기반 이메일 발송"""
        try:
            # HTML 이메일 렌더링
            html_content = render_to_string(
                f'notifications/email/{template_name}.html',
                context
            )
            # 플레인 텍스트 버전 생성
            text_content = strip_tags(html_content)
            
            # 이메일 메시지 생성
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[to_email]
            )
            
            # HTML 버전 추가
            msg.attach_alternative(html_content, "text/html")
            
            # 이메일 발송
            await msg.send()
            return True
            
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            return False

    @staticmethod
    async def send_subscription_expiry_email(subscription):
        """수강권 만료 알림 이메일"""
        context = {
            'student_name': subscription.student.get_full_name() or subscription.student.username,
            'class_name': subscription.dance_class.name,
            'expiry_date': subscription.end_date.strftime('%Y-%m-%d'),
            'renewal_url': f"{settings.FRONTEND_URL}/subscriptions/{subscription.id}/renew",
        }
        
        await EmailService.send_template_email(
            to_email=subscription.student.email,
            template_name='subscription_expiry',
            context=context,
            subject='[Dance Academy] 수강권 만료 예정 알림'
        )

    @staticmethod
    async def send_class_reminder_email(attendance):
        """수업 알림 이메일"""
        context = {
            'student_name': attendance.student.get_full_name() or attendance.student.username,
            'class_name': attendance.dance_class.name,
            'class_time': attendance.schedule.start_time.strftime('%H:%M'),
            'class_room': attendance.schedule.room,
            'instructor_name': attendance.dance_class.instructor.get_full_name(),
            'class_url': f"{settings.FRONTEND_URL}/classes/{attendance.dance_class.id}",
        }
        
        await EmailService.send_template_email(
            to_email=attendance.student.email,
            template_name='class_reminder',
            context=context,
            subject='[Dance Academy] 오늘의 수업 알림'
        )
# backend/notifications/models.py

from django.db import models
from django.conf import settings

class Notification(models.Model):
    TYPE_CHOICES = (
        ('subscription_expiry', '수강권 만료 예정'),
        ('class_reminder', '수업 알림'),
        ('makeup_status', '보강 신청 상태 변경'),
        ('pause_status', '일시정지 신청 상태 변경'),
        ('announcement', '공지사항'),
        ('attendance', '출결 알림'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name='사용자'
    )
    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        verbose_name='알림 종류'
    )
    title = models.CharField(
        max_length=200,
        verbose_name='제목'
    )
    message = models.TextField(
        verbose_name='내용'
    )
    read = models.BooleanField(
        default=False,
        verbose_name='읽음 여부'
    )
    link = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='관련 링크'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notification'
        verbose_name = '알림'
        verbose_name_plural = '알림 목록'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}의 알림: {self.title}"

class NotificationPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notification_preferences',
        verbose_name='사용자'
    )
    subscription_expiry = models.BooleanField(
        default=True,
        verbose_name='수강권 만료 알림'
    )
    class_reminder = models.BooleanField(
        default=True,
        verbose_name='수업 알림'
    )
    makeup_status = models.BooleanField(
        default=True,
        verbose_name='보강 상태 알림'
    )
    pause_status = models.BooleanField(
        default=True,
        verbose_name='일시정지 상태 알림'
    )
    announcement = models.BooleanField(
        default=True,
        verbose_name='공지사항 알림'
    )
    attendance = models.BooleanField(
        default=True,
        verbose_name='출결 알림'
    )
    email_notifications = models.BooleanField(
        default=True,
        verbose_name='이메일 알림'
    )
    push_notifications = models.BooleanField(
        default=True,
        verbose_name='푸시 알림'
    )

    class Meta:
        db_table = 'notification_preference'
        verbose_name = '알림 설정'
        verbose_name_plural = '알림 설정 목록'

    def __str__(self):
        return f"{self.user.username}의 알림 설정"
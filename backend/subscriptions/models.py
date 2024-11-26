# backend/subscriptions/models.py

from django.db import models
from django.conf import settings

class Subscription(models.Model):
    STATUS_CHOICES = (
        ('active', '이용중'),
        ('paused', '일시정지'),
        ('expired', '만료'),
        ('cancelled', '취소')
    )
    TYPE_CHOICES = (
        ('days', '기간제'),
        ('counts', '횟수제')
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'user_type': 'student'},
        verbose_name='수강생'
    )
    dance_class = models.ForeignKey(
        'classes.DanceClass',
        on_delete=models.PROTECT,
        verbose_name='수업'
    )
    subscription_type = models.CharField(
        max_length=10,
        choices=TYPE_CHOICES,
        verbose_name='수강권 종류'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='상태'
    )
    start_date = models.DateField(verbose_name='시작일')
    end_date = models.DateField(verbose_name='종료일')
    total_classes = models.PositiveIntegerField(
        null=True, 
        blank=True,
        verbose_name='전체 수업 횟수'
    )
    remaining_classes = models.PositiveIntegerField(
        null=True, 
        blank=True,
        verbose_name='남은 수업 횟수'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subscription'
        verbose_name = '수강권'
        verbose_name_plural = '수강권 목록'

    def __str__(self):
        return f"{self.student.username}의 {self.dance_class.name} 수강권"

class SubscriptionPause(models.Model):
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        verbose_name='수강권'
    )
    start_date = models.DateField(verbose_name='시작일')
    end_date = models.DateField(verbose_name='종료일')
    reason = models.TextField(verbose_name='사유')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'subscription_pause'
        verbose_name = '수강권 일시정지'
        verbose_name_plural = '수강권 일시정지 목록'

    def __str__(self):
        return f"{self.subscription} ({self.start_date} ~ {self.end_date})"
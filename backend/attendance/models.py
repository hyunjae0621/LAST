# backend/attendance/models.py

from django.db import models
from django.conf import settings

class Attendance(models.Model):
    STATUS_CHOICES = (
        ('present', '출석'),
        ('absent', '결석'),
        ('late', '지각'),
        ('excused', '사유결석'),
        ('makeup', '보강')
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
    schedule = models.ForeignKey(
        'classes.ClassSchedule',
        on_delete=models.PROTECT,
        verbose_name='수업 일정'
    )
    date = models.DateField(verbose_name='날짜')
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        verbose_name='출결 상태'
    )
    memo = models.TextField(
        blank=True,
        verbose_name='메모'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendance'
        verbose_name = '출석'
        verbose_name_plural = '출석 관리'
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'dance_class', 'date'],
                name='unique_daily_attendance'
            )
        ]

    def __str__(self):
        return f"{self.student.username} - {self.dance_class.name} ({self.date})"

class MakeupClass(models.Model):
    STATUS_CHOICES = (
        ('pending', '대기'),
        ('approved', '승인'),
        ('rejected', '거절'),
        ('completed', '완료')
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        verbose_name='수강생'
    )
    original_class = models.ForeignKey(
        'classes.ClassSchedule',
        on_delete=models.PROTECT,
        related_name='original_makeup_classes',
        verbose_name='원래 수업'
    )
    makeup_class = models.ForeignKey(
        'classes.ClassSchedule',
        on_delete=models.PROTECT,
        related_name='makeup_classes',
        verbose_name='보강 수업'
    )
    original_date = models.DateField(verbose_name='원래 수업일')
    makeup_date = models.DateField(verbose_name='보강 수업일')
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='상태'
    )
    reason = models.TextField(verbose_name='사유')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'makeup_class'
        verbose_name = '보강'
        verbose_name_plural = '보강 목록'

    def __str__(self):
        return f"{self.student.username}의 보강 신청 ({self.original_date} → {self.makeup_date})"
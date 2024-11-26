# backend/classes/models.py

from django.db import models
from django.conf import settings

class DanceClass(models.Model):
    CLASS_STATUS_CHOICES = (
        ('active', '운영중'),
        ('pending', '준비중'),
        ('closed', '종료')
    )
    DIFFICULTY_CHOICES = (
        ('beginner', '초급'),
        ('intermediate', '중급'),
        ('advanced', '고급')
    )

    name = models.CharField(
        max_length=100,
        verbose_name='수업명'
    )
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'user_type': 'instructor'},
        verbose_name='강사'
    )
    description = models.TextField(
        blank=True,
        verbose_name='수업 설명'
    )
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='beginner',
        verbose_name='난이도'
    )
    capacity = models.PositiveIntegerField(
        verbose_name='정원'
    )
    price_per_month = models.PositiveIntegerField(
        default=100000, 
        verbose_name='월 수강료'
    )
    status = models.CharField(
        max_length=20,
        choices=CLASS_STATUS_CHOICES,
        default='pending',
        verbose_name='상태'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dance_class'
        verbose_name = '수업'
        verbose_name_plural = '수업 목록'

    def __str__(self):
        return f"{self.name} ({self.get_difficulty_display()})"

    @property
    def current_students_count(self):
        return self.subscription_set.filter(status='active').count()

class ClassSchedule(models.Model):
    WEEKDAY_CHOICES = (
        (0, '월요일'),
        (1, '화요일'),
        (2, '수요일'),
        (3, '목요일'),
        (4, '금요일'),
        (5, '토요일'),
        (6, '일요일'),
    )

    dance_class = models.ForeignKey(
        DanceClass,
        on_delete=models.CASCADE,
        related_name='schedules',
        verbose_name='수업'
    )
    weekday = models.IntegerField(
        choices=WEEKDAY_CHOICES,
        verbose_name='요일'
    )
    start_time = models.TimeField(
        verbose_name='시작 시간'
    )
    end_time = models.TimeField(
        verbose_name='종료 시간'
    )
    room = models.CharField(
        max_length=50,
        default='메인 연습실',
        verbose_name='강의실'
    )

    class Meta:
        db_table = 'class_schedule'
        verbose_name = '수업 일정'
        verbose_name_plural = '수업 일정 목록'
        ordering = ['weekday', 'start_time']
        constraints = [
            models.UniqueConstraint(
                fields=['dance_class', 'weekday', 'start_time'],
                name='unique_class_schedule'
            )
        ]

    def __str__(self):
        return f"{self.dance_class.name} ({self.get_weekday_display()} {self.start_time.strftime('%H:%M')}~{self.end_time.strftime('%H:%M')})"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_time >= self.end_time:
            raise ValidationError('종료 시간은 시작 시간보다 늦어야 합니다.')

        # 같은 요일에 시간이 겹치는 수업이 있는지 확인
        overlapping = ClassSchedule.objects.filter(
            weekday=self.weekday,
            room=self.room
        ).exclude(id=self.id)

        for schedule in overlapping:
            if (self.start_time <= schedule.end_time and 
                self.end_time >= schedule.start_time):
                raise ValidationError('해당 시간에 이미 다른 수업이 있습니다.')
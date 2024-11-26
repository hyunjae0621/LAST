# backend/classes/models.py

from django.db import models
from django.conf import settings

class DanceClass(models.Model):
    name = models.CharField(max_length=100, verbose_name='수업명')
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'user_type': 'instructor'},
        verbose_name='강사'
    )
    description = models.TextField(blank=True, verbose_name='수업 설명')
    capacity = models.PositiveIntegerField(verbose_name='정원')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dance_class'
        verbose_name = '수업'
        verbose_name_plural = '수업 목록'

    def __str__(self):
        return f"{self.name} (강사: {self.instructor.username})"

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
        verbose_name='수업'
    )
    weekday = models.IntegerField(
        choices=WEEKDAY_CHOICES,
        verbose_name='요일'
    )
    start_time = models.TimeField(verbose_name='시작 시간')
    end_time = models.TimeField(verbose_name='종료 시간')
    
    class Meta:
        db_table = 'class_schedule'
        verbose_name = '수업 일정'
        verbose_name_plural = '수업 일정 목록'
        ordering = ['weekday', 'start_time']

    def __str__(self):
        return f"{self.dance_class.name} ({self.get_weekday_display()} {self.start_time.strftime('%H:%M')}~{self.end_time.strftime('%H:%M')})"
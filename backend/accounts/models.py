# backend/accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', '관리자'),
        ('instructor', '강사'),
        ('student', '수강생'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    phone_number = models.CharField(max_length=11, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to.',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
    )

    class Meta:
        db_table = 'user'

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
    

class StudentProfile(models.Model):
    GENDER_CHOICES = (
        ('M', '남성'),
        ('F', '여성'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'student'},
        related_name='student_profile'
    )
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        verbose_name='성별'
    )
    birth_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='생년월일'
    )
    emergency_contact = models.CharField(
        max_length=15,
        blank=True,
        verbose_name='비상연락처'
    )
    address = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='주소'
    )
    note = models.TextField(
        blank=True,
        verbose_name='특이사항'
    )
    join_date = models.DateField(
        auto_now_add=True,
        verbose_name='가입일'
    )
    last_visit = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='최근 방문일'
    )

    class Meta:
        db_table = 'student_profile'
        verbose_name = '수강생 프로필'
        verbose_name_plural = '수강생 프로필 목록'

    def __str__(self):
        return f"{self.user.username}의 프로필"
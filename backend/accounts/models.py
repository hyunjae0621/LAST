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
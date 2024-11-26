# backend/accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, StudentProfile



@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'birth_date', 'emergency_contact', 'join_date', 'last_visit')
    list_filter = ('gender', 'join_date')
    search_fields = ('user__username', 'user__email', 'emergency_contact')
    readonly_fields = ('join_date',)
    fieldsets = (
        ('기본 정보', {
            'fields': ('user', 'gender', 'birth_date')
        }),
        ('연락처', {
            'fields': ('emergency_contact', 'address')
        }),
        ('추가 정보', {
            'fields': ('note', 'join_date', 'last_visit')
        })
    )


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'phone_number', 'is_active', 'user_type')
    list_filter = ('user_type', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('개인정보', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'date_of_birth')}),
        ('권한', {'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'user_type'),
        }),
    )
    search_fields = ('username', 'email', 'phone_number')
    ordering = ('username',)
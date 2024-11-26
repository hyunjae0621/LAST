# backend/notifications/admin.py

from django.contrib import admin
from .models import Notification, NotificationPreference

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_type', 'title', 'read', 'created_at')
    list_filter = ('notification_type', 'read', 'created_at')
    search_fields = ('user__username', 'title', 'message')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('기본 정보', {
            'fields': ('user', 'notification_type', 'title')
        }),
        ('내용', {
            'fields': ('message', 'link')
        }),
        ('상태', {
            'fields': ('read',)
        })
    )

@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_notifications', 'push_notifications')
    list_filter = ('email_notifications', 'push_notifications')
    search_fields = ('user__username',)
    
    fieldsets = (
        ('알림 종류 설정', {
            'fields': (
                'subscription_expiry', 'class_reminder', 'makeup_status',
                'pause_status', 'announcement', 'attendance'
            )
        }),
        ('알림 방법 설정', {
            'fields': ('email_notifications', 'push_notifications')
        })
    )
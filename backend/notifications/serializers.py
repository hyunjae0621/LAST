# backend/notifications/serializers.py

from rest_framework import serializers
from .models import Notification, NotificationSetting

class NotificationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    created_at_display = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = (
            'id', 'type', 'type_display', 'title', 'message',
            'read', 'link', 'created_at', 'created_at_display'
        )

    def get_created_at_display(self, obj):
        # 알림 시간 표시 형식 변경
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        diff = now - obj.created_at

        if diff < timedelta(minutes=1):
            return '방금 전'
        elif diff < timedelta(hours=1):
            return f'{diff.seconds // 60}분 전'
        elif diff < timedelta(days=1):
            return f'{diff.seconds // 3600}시간 전'
        elif diff < timedelta(days=7):
            return f'{diff.days}일 전'
        else:
            return obj.created_at.strftime('%Y-%m-%d')

class NotificationSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationSetting
        fields = (
            'email_notification', 'subscription_expiry', 'class_reminder',
            'pause_status', 'makeup_status', 'announcement'
        )
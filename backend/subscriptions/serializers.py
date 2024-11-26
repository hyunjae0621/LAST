# backend/subscriptions/serializers.py

from rest_framework import serializers
from .models import Subscription, SubscriptionPause

class SubscriptionPauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPause
        fields = ('id', 'start_date', 'end_date', 'reason', 'created_at')

class SubscriptionListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    class_name = serializers.CharField(source='dance_class.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    subscription_type_display = serializers.CharField(source='get_subscription_type_display', read_only=True)
    days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = (
            'id', 'student', 'student_name', 'dance_class', 'class_name',
            'subscription_type', 'subscription_type_display',
            'start_date', 'end_date', 'total_classes', 'remaining_classes',
            'status', 'status_display', 'price_paid', 'days_remaining'
        )

    def get_days_remaining(self, obj):
        if obj.status == 'active' and obj.end_date:
            from django.utils.timezone import now
            from datetime import datetime
            today = now().date()
            return (obj.end_date - today).days
        return None

class SubscriptionDetailSerializer(SubscriptionListSerializer):
    pauses = SubscriptionPauseSerializer(many=True, read_only=True)
    
    class Meta(SubscriptionListSerializer.Meta):
        fields = SubscriptionListSerializer.Meta.fields + (
            'payment_method', 'created_at', 'updated_at', 'pauses'
        )

class SubscriptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = (
            'student', 'dance_class', 'subscription_type',
            'start_date', 'end_date', 'total_classes',
            'remaining_classes', 'price_paid', 'payment_method'
        )

    def validate(self, data):
        if data['subscription_type'] == 'counts':
            if not data.get('total_classes'):
                raise serializers.ValidationError(
                    "횟수제 수강권은 전체 수업 횟수를 지정해야 합니다."
                )
            if not data.get('remaining_classes'):
                data['remaining_classes'] = data['total_classes']
                
        return data

class SubscriptionPauseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPause
        fields = ('subscription', 'start_date', 'end_date', 'reason')
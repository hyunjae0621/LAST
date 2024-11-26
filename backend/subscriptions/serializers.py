from rest_framework import serializers
from .models import Subscription

class SubscriptionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = (
            'id', 'student', 'dance_class', 'subscription_type',
            'status', 'start_date', 'end_date', 'total_classes',
            'remaining_classes'
        )
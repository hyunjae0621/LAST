from rest_framework import serializers
from .models import Attendance

class AttendanceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = (
            'id', 'student', 'dance_class', 'schedule',
            'date', 'status', 'memo'
        )
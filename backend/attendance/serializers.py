# backend/attendance/serializers.py

from rest_framework import serializers
from .models import Attendance, MakeupClass
from accounts.serializers import StudentListSerializer

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    class_name = serializers.CharField(source='dance_class.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Attendance
        fields = (
            'id', 'student', 'student_name', 'dance_class', 'class_name',
            'schedule', 'date', 'status', 'status_display', 'memo'
        )

class AttendanceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('student', 'dance_class', 'schedule', 'date', 'status', 'memo')

class MakeupClassSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    original_class_name = serializers.CharField(source='original_class.dance_class.name', read_only=True)
    makeup_class_name = serializers.CharField(source='makeup_class.dance_class.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = MakeupClass
        fields = (
            'id', 'student', 'student_name', 
            'original_class', 'original_class_name', 'original_date',
            'makeup_class', 'makeup_class_name', 'makeup_date',
            'reason', 'status', 'status_display'
        )
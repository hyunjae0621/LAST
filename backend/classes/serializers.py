# backend/classes/serializers.py

from rest_framework import serializers
from .models import DanceClass, ClassSchedule
from accounts.serializers import UserSerializer

class ClassScheduleSerializer(serializers.ModelSerializer):
    weekday_display = serializers.CharField(source='get_weekday_display', read_only=True)
    
    class Meta:
        model = ClassSchedule
        fields = (
            'id', 'weekday', 'weekday_display', 'start_time', 
            'end_time', 'room'
        )

class DanceClassListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    current_students_count = serializers.IntegerField(read_only=True)
    schedules_count = serializers.IntegerField(source='schedules.count', read_only=True)

    class Meta:
        model = DanceClass
        fields = (
            'id', 'name', 'instructor_name', 'difficulty_display',
            'capacity', 'current_students_count', 'schedules_count',
            'price_per_month', 'status', 'status_display'
        )

class DanceClassDetailSerializer(serializers.ModelSerializer):
    instructor = UserSerializer(read_only=True)
    schedules = ClassScheduleSerializer(many=True, read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    current_students_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = DanceClass
        fields = (
            'id', 'name', 'instructor', 'description', 'difficulty',
            'difficulty_display', 'capacity', 'current_students_count',
            'price_per_month', 'status', 'status_display', 'schedules',
            'created_at', 'updated_at'
        )

class DanceClassCreateUpdateSerializer(serializers.ModelSerializer):
    schedules = ClassScheduleSerializer(many=True)

    class Meta:
        model = DanceClass
        fields = (
            'name', 'instructor', 'description', 'difficulty',
            'capacity', 'price_per_month', 'status', 'schedules'
        )

    def create(self, validated_data):
        schedules_data = validated_data.pop('schedules')
        dance_class = DanceClass.objects.create(**validated_data)
        
        for schedule_data in schedules_data:
            ClassSchedule.objects.create(dance_class=dance_class, **schedule_data)
        
        return dance_class

    def update(self, instance, validated_data):
        schedules_data = validated_data.pop('schedules', None)
        
        # 기본 필드 업데이트
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 스케줄 업데이트
        if schedules_data is not None:
            instance.schedules.all().delete()  # 기존 스케줄 삭제
            for schedule_data in schedules_data:
                ClassSchedule.objects.create(dance_class=instance, **schedule_data)

        return instance

    def validate_schedules(self, schedules):
        if not schedules:
            raise serializers.ValidationError("최소 1개 이상의 수업 일정이 필요합니다.")
        
        # 시간 중복 검사
        schedule_times = {}
        for schedule in schedules:
            key = (schedule['weekday'], schedule['room'])
            if key in schedule_times:
                for existing in schedule_times[key]:
                    if (schedule['start_time'] < existing['end_time'] and 
                        schedule['end_time'] > existing['start_time']):
                        raise serializers.ValidationError(
                            f"{schedule['get_weekday_display']} {schedule['start_time']}~{schedule['end_time']} "
                            "시간에 이미 다른 수업이 있습니다."
                        )
                schedule_times[key].append(schedule)
            else:
                schedule_times[key] = [schedule]

        return schedules
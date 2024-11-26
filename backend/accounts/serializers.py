# backend/accounts/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import StudentProfile


User = get_user_model()

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ('gender', 'birth_date', 'emergency_contact', 'address', 'note', 'join_date', 'last_visit')

class StudentListSerializer(serializers.ModelSerializer):
    profile = StudentProfileSerializer(source='student_profile')
    active_subscriptions_count = serializers.IntegerField(read_only=True)
    attendance_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'profile', 
                'active_subscriptions_count', 'attendance_rate', 'is_active')

class StudentDetailSerializer(StudentListSerializer):
    class Meta(StudentListSerializer.Meta):
        fields = StudentListSerializer.Meta.fields + (
            'date_joined', 'last_login'
        )

class StudentCreateSerializer(serializers.ModelSerializer):
    profile = StudentProfileSerializer()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'phone_number', 'profile')

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        validated_data['user_type'] = 'student'
        
        user = User.objects.create_user(**validated_data)
        StudentProfile.objects.filter(user=user).update(**profile_data)
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # 토큰에 추가 정보 포함
        token['username'] = user.username
        token['user_type'] = user.user_type
        
        return token

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'user_type', 'phone_number', 'date_of_birth')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            user_type=validated_data.get('user_type', 'student'),
            phone_number=validated_data.get('phone_number', ''),
            date_of_birth=validated_data.get('date_of_birth'),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
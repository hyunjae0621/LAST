# backend/classes/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from .models import DanceClass, ClassSchedule
from subscriptions.models import Subscription
from .serializers import (
    DanceClassListSerializer,
    DanceClassDetailSerializer,
    DanceClassCreateUpdateSerializer,
    ClassScheduleSerializer
)

User = get_user_model()

class DanceClassViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = DanceClass.objects.select_related('instructor').prefetch_related('schedules')
        
        # 현재 수강생 수 계산
        # queryset = queryset.annotate(
        #     current_students_count=Count(
        #         'subscription',
        #         filter=Q(subscription__status='active')
        #     )
        # )

        # 검색 기능
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(instructor__username__icontains=search) |
                Q(description__icontains=search)
            )

        # 필터링
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)

        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset.order_by('-created_at')

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DanceClassCreateUpdateSerializer
        if self.action == 'list':
            return DanceClassListSerializer
        return DanceClassDetailSerializer

    @action(detail=True, methods=['get'])
    def schedules(self, request, pk=None):
        dance_class = self.get_object()
        serializer = ClassScheduleSerializer(dance_class.schedules.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        dance_class = self.get_object()
        active_subscriptions = dance_class.subscription_set.filter(
            status='active'
        ).select_related('student')
        
        students_data = [{
            'id': sub.student.id,
            'username': sub.student.username,
            'subscription_id': sub.id,
            'start_date': sub.start_date,
            'end_date': sub.end_date
        } for sub in active_subscriptions]
        
        return Response(students_data)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    today = timezone.now().date()
    first_day_of_month = today.replace(day=1)
    
    # 전체 수강생 수
    total_students = User.objects.filter(user_type='student', is_active=True).count()
    
    # 오늘의 수업 수
    todays_classes = ClassSchedule.objects.filter(
        weekday=today.weekday()
    ).count()
    
    # 이번 달 신규 등록
    new_students = User.objects.filter(
        user_type='student',
        date_joined__gte=first_day_of_month
    ).count()
    
    # 이번 달 매출 (임시 더미 데이터)
    monthly_revenue = 2450000  # 실제 결제 모듈 연동 전 임시 데이터
    
    return Response({
        'total_students': total_students,
        'todays_classes': todays_classes,
        'new_students': new_students,
        'monthly_revenue': monthly_revenue
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def todays_classes(request):
    today = timezone.now().date()
    weekday = today.weekday()
    
    classes = ClassSchedule.objects.filter(
        weekday=weekday
    ).select_related('dance_class', 'dance_class__instructor')
    
    class_data = []
    for schedule in classes:
        total_students = Subscription.objects.filter(
            dance_class=schedule.dance_class,
            status='active'
        ).count()
        
        class_data.append({
            'id': schedule.id,
            'name': schedule.dance_class.name,
            'time': f"{schedule.start_time.strftime('%H:%M')} - {schedule.end_time.strftime('%H:%M')}",
            'instructor': schedule.dance_class.instructor.get_full_name() or schedule.dance_class.instructor.username,
            'attendees': f"{total_students}/{schedule.dance_class.capacity}"
        })
    
    return Response(class_data)
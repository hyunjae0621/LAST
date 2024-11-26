# backend/attendance/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from datetime import datetime
from .models import Attendance, MakeupClass
from .serializers import (
    AttendanceSerializer,
    AttendanceCreateSerializer,
    MakeupClassSerializer
)

class AttendanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AttendanceCreateSerializer
        return AttendanceSerializer

    def get_queryset(self):
        queryset = Attendance.objects.all()
        
        # 특정 날짜 필터링
        date = self.request.query_params.get('date', None)
        if date:
            queryset = queryset.filter(date=date)

        # 특정 수업 필터링
        class_id = self.request.query_params.get('class_id', None)
        if class_id:
            queryset = queryset.filter(dance_class_id=class_id)

        # 특정 학생 필터링
        student_id = self.request.query_params.get('student_id', None)
        if student_id:
            queryset = queryset.filter(student_id=student_id)

        # 검색 기능
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(student__username__icontains=search) |
                Q(dance_class__name__icontains=search)
            )

        return queryset.select_related('student', 'dance_class', 'schedule')

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """여러 출석 데이터를 한 번에 생성/업데이트"""
        attendance_data = request.data
        created = []
        updated = []
        errors = []

        for data in attendance_data:
            try:
                attendance, created_flag = Attendance.objects.update_or_create(
                    student_id=data['student'],
                    dance_class_id=data['dance_class'],
                    date=data['date'],
                    defaults={
                        'schedule_id': data['schedule'],
                        'status': data.get('status', 'absent'),
                        'memo': data.get('memo', '')
                    }
                )
                if created_flag:
                    created.append(attendance)
                else:
                    updated.append(attendance)
            except Exception as e:
                errors.append({
                    'data': data,
                    'error': str(e)
                })

        return Response({
            'created': AttendanceSerializer(created, many=True).data,
            'updated': AttendanceSerializer(updated, many=True).data,
            'errors': errors
        })

class MakeupClassViewSet(viewsets.ModelViewSet):
    serializer_class = MakeupClassSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MakeupClass.objects.all()
        
        # 상태별 필터링
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)

        # 특정 학생 필터링
        student_id = self.request.query_params.get('student_id', None)
        if student_id:
            queryset = queryset.filter(student_id=student_id)

        # 날짜 범위 필터링
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(
                Q(original_date__range=[start_date, end_date]) |
                Q(makeup_date__range=[start_date, end_date])
            )

        return queryset.select_related(
            'student', 
            'original_class__dance_class', 
            'makeup_class__dance_class'
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        makeup = self.get_object()
        makeup.status = 'approved'
        makeup.save()
        return Response(self.get_serializer(makeup).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        makeup = self.get_object()
        makeup.status = 'rejected'
        makeup.save()
        return Response(self.get_serializer(makeup).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        makeup = self.get_object()
        makeup.status = 'completed'
        makeup.save()
        
        # 출석 기록 생성
        Attendance.objects.create(
            student=makeup.student,
            dance_class=makeup.makeup_class.dance_class,
            schedule=makeup.makeup_class,
            date=makeup.makeup_date,
            status='makeup'
        )
        
        return Response(self.get_serializer(makeup).data)
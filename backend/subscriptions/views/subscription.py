# backend/subscriptions/views/subscription.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from datetime import timedelta
from django.utils import timezone

from ..models import Subscription, SubscriptionPause
from ..serializers import (
    SubscriptionListSerializer,
    SubscriptionDetailSerializer,
    SubscriptionCreateSerializer,
    SubscriptionPauseSerializer
)

class SubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Subscription.objects.select_related(
            'student', 'dance_class'
        ).prefetch_related('pauses')
        
        # 상태 필터링
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
            
        # 수업별 필터링
        class_id = self.request.query_params.get('class_id', None)
        if class_id:
            queryset = queryset.filter(dance_class_id=class_id)
            
        # 학생별 필터링
        student_id = self.request.query_params.get('student_id', None)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
            
        # 만료 예정 필터링
        expiring_soon = self.request.query_params.get('expiring_soon', None)
        if expiring_soon:
            thirty_days_later = timezone.now().date() + timedelta(days=30)
            queryset = queryset.filter(
                status='active',
                end_date__lte=thirty_days_later
            )
            
        # 검색
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(student__username__icontains=search) |
                Q(dance_class__name__icontains=search)
            )
            
        return queryset.order_by('-created_at')
        
    def get_serializer_class(self):
        if self.action == 'create':
            return SubscriptionCreateSerializer
        if self.action == 'list':
            return SubscriptionListSerializer
        return SubscriptionDetailSerializer
        
    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        subscription = self.get_object()
        serializer = SubscriptionPauseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(subscription=subscription)
            subscription.status = 'paused'
            subscription.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        subscription = self.get_object()
        pause = subscription.pauses.order_by('-created_at').first()
        if pause:
            duration = (pause.end_date - pause.start_date).days
            subscription.end_date += timedelta(days=duration)
            subscription.status = 'active'
            subscription.save()
            return Response(SubscriptionDetailSerializer(subscription).data)
            
    @action(detail=True, methods=['post'])
    def extend(self, request, pk=None):
        subscription = self.get_object()
        days = request.data.get('days', 0)
        if days > 0:
            subscription.end_date += timedelta(days=days)
            subscription.save()
            return Response(SubscriptionDetailSerializer(subscription).data)
        return Response(
            {'error': '연장할 일수를 지정해주세요.'},
            status=status.HTTP_400_BAD_REQUEST
        )


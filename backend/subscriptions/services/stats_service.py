# backend/subscriptions/services/stats_service.py
from django.db.models import Sum, Count, F, Q, Avg
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone
from datetime import timedelta
from ..models import Subscription
from attendance.models import Attendance
from classes.models import DanceClass

class RevenueStatsService:
    @staticmethod
    async def get_revenue_summary(start_date=None, end_date=None):
        """매출 요약 통계"""
        query = Subscription.objects.all()
        
        if start_date:
            query = query.filter(created_at__gte=start_date)
        if end_date:
            query = query.filter(created_at__lte=end_date)
            
        summary = await query.aggregate(
            total_revenue=Sum('price_paid'),
            total_subscriptions=Count('id'),
            active_subscriptions=Count(
                'id',
                filter=Q(status='active')
            ),
            avg_price=Avg('price_paid')
        )
        
        # 유형별 매출
        subscription_types = await query.values(
            'subscription_type'
        ).annotate(
            revenue=Sum('price_paid'),
            count=Count('id')
        )
        
        summary['subscription_types'] = subscription_types
        return summary

    @staticmethod
    async def get_monthly_revenue(year=None, month=None):
        """월별 매출 통계"""
        query = Subscription.objects.all()
        
        if year:
            query = query.filter(created_at__year=year)
        if month:
            query = query.filter(created_at__month=month)
            
        monthly_data = await query.annotate(
            month=TruncMonth('created_at')
        ).values(
            'month'
        ).annotate(
            revenue=Sum('price_paid'),
            subscriptions=Count('id')
        ).order_by('month')
        
        return monthly_data

    @staticmethod
    async def get_class_revenue(class_id, start_date=None, end_date=None):
        """수업별 매출 통계"""
        query = Subscription.objects.filter(dance_class_id=class_id)
        
        if start_date:
            query = query.filter(created_at__gte=start_date)
        if end_date:
            query = query.filter(created_at__lte=end_date)
            
        revenue_data = await query.aggregate(
            total_revenue=Sum('price_paid'),
            total_subscriptions=Count('id'),
            active_subscriptions=Count(
                'id',
                filter=Q(status='active')
            )
        )
        
        # 일별 매출
        daily_data = await query.annotate(
            date=TruncDate('created_at')
        ).values(
            'date'
        ).annotate(
            revenue=Sum('price_paid'),
            subscriptions=Count('id')
        ).order_by('date')
        
        return {
            'summary': revenue_data,
            'daily_data': daily_data
        }

    @staticmethod
    async def get_instructor_revenue(instructor_id, start_date=None, end_date=None):
        """강사별 매출 통계"""
        query = Subscription.objects.filter(
            dance_class__instructor_id=instructor_id
        )
        
        if start_date:
            query = query.filter(created_at__gte=start_date)
        if end_date:
            query = query.filter(created_at__lte=end_date)
            
        revenue_data = await query.aggregate(
            total_revenue=Sum('price_paid'),
            total_subscriptions=Count('id'),
            total_classes=Count('dance_class', distinct=True)
        )
        
        # 수업별 매출
        class_data = await query.values(
            'dance_class__name'
        ).annotate(
            revenue=Sum('price_paid'),
            subscriptions=Count('id')
        ).order_by('-revenue')
        
        return {
            'summary': revenue_data,
            'class_data': class_data
        }
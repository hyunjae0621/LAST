# backend/accounts/services/analytics_service.py
from django.db.models import Count, Avg, F, Q, Sum, Case, When, FloatField
from django.db.models.functions import TruncMonth, ExtractHour
from django.utils import timezone
from datetime import timedelta
from ..models import User
from subscriptions.models import Subscription
from attendance.models import Attendance

class StudentAnalyticsService:
    @staticmethod
    async def get_enrollment_trends(start_date=None, end_date=None):
        """수강생 등록 동향"""
        query = User.objects.filter(user_type='student')
        
        if start_date:
            query = query.filter(date_joined__gte=start_date)
        if end_date:
            query = query.filter(date_joined__lte=end_date)

        # 월별 신규 등록 수강생 수
        monthly_signups = await query.annotate(
            month=TruncMonth('date_joined')
        ).values('month').annotate(
            new_students=Count('id')
        ).order_by('month')

        # 활성/비활성 수강생 수
        status_counts = await Subscription.objects.filter(
            student__in=query
        ).values('student').annotate(
            active_count=Count('id', filter=Q(status='active')),
            expired_count=Count('id', filter=Q(status='expired')),
            cancelled_count=Count('id', filter=Q(status='cancelled'))
        ).aggregate(
            total_active=Sum('active_count'),
            total_expired=Sum('expired_count'),
            total_cancelled=Sum('cancelled_count')
        )

        return {
            'monthly_signups': monthly_signups,
            'status_counts': status_counts
        }

    @staticmethod
    async def get_retention_analysis(months=6):
        """기간별 수강생 유지율 분석"""
        now = timezone.now()
        start_date = now - timedelta(days=30 * months)
        
        # 코호트 분석: 등록 월별로 그룹화하여 유지율 계산
        cohorts = await User.objects.filter(
            user_type='student',
            date_joined__gte=start_date
        ).annotate(
            cohort_month=TruncMonth('date_joined')
        ).values('cohort_month').annotate(
            total_users=Count('id'),
            retained_users=Count(
                'subscription',
                filter=Q(subscription__status='active')
            )
        ).order_by('cohort_month')

        # 월별 유지율 계산
        for cohort in cohorts:
            cohort['retention_rate'] = (
                cohort['retained_users'] / cohort['total_users'] * 100
                if cohort['total_users'] > 0 else 0
            )

        return cohorts

    @staticmethod
    async def get_class_preferences():
        """수강생 선호도 분석"""
        # 수업 유형별 수강생 수
        class_preferences = await Subscription.objects.filter(
            status='active'
        ).values(
            'dance_class__name',
            'dance_class__difficulty'
        ).annotate(
            student_count=Count('student', distinct=True),
            avg_attendance_rate=Avg(
                Case(
                    When(
                        Q(student__attendance__status='present') |
                        Q(student__attendance__status='late'),
                        then=100
                    ),
                    default=0,
                    output_field=FloatField(),
                )
            )
        ).order_by('-student_count')

        # 시간대별 선호도
        time_preferences = await Attendance.objects.filter(
            status='present'
        ).annotate(
            hour=ExtractHour('schedule__start_time')
        ).values('hour').annotate(
            attendance_count=Count('id')
        ).order_by('hour')

        return {
            'class_preferences': class_preferences,
            'time_preferences': time_preferences
        }

    @staticmethod
    async def get_student_behavior(student_id):
        """개별 수강생 행동 분석"""
        # 출석 패턴
        attendance_pattern = await Attendance.objects.filter(
            student_id=student_id
        ).values('status').annotate(
            count=Count('id')
        ).order_by('status')
        
        # 선호 수업 시간
        preferred_times = await Attendance.objects.filter(
            student_id=student_id,
            status='present'
        ).annotate(
            hour=ExtractHour('schedule__start_time')
        ).values('hour').annotate(
            count=Count('id')
        ).order_by('-count')[:3]
        
        # 수강 이력
        subscription_history = await Subscription.objects.filter(
            student_id=student_id
        ).values(
            'dance_class__name',
            'start_date',
            'end_date',
            'status'
        ).order_by('-start_date')

        return {
            'attendance_pattern': attendance_pattern,
            'preferred_times': preferred_times,
            'subscription_history': subscription_history
        }
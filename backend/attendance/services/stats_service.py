# backend/attendance/services/stats_service.py
from django.db.models import Count, F, FloatField, Avg, Q, Case, When
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from ..models import Attendance

class AttendanceStatsService:
    @staticmethod
    async def get_student_attendance_stats(student_id, start_date=None, end_date=None):
        """학생별 출석 통계"""
        query = Attendance.objects.filter(student_id=student_id)
        
        if start_date:
            query = query.filter(date__gte=start_date)
        if end_date:
            query = query.filter(date__lte=end_date)
            
        stats = await query.aggregate(
            total_classes=Count('id'),
            present_count=Count('id', filter=Q(status='present')),
            late_count=Count('id', filter=Q(status='late')),
            absent_count=Count('id', filter=Q(status='absent')),
            excused_count=Count('id', filter=Q(status='excused')),
            makeup_count=Count('id', filter=Q(status='makeup'))
        )
        
        total = stats['total_classes']
        if total > 0:
            stats['attendance_rate'] = (
                (stats['present_count'] + stats['late_count'] + stats['makeup_count']) 
                / total * 100
            )
        else:
            stats['attendance_rate'] = 0
            
        return stats

    @staticmethod
    async def get_class_attendance_stats(class_id, start_date=None, end_date=None):
        """수업별 출석 통계"""
        query = Attendance.objects.filter(dance_class_id=class_id)
        
        if start_date:
            query = query.filter(date__gte=start_date)
        if end_date:
            query = query.filter(date__lte=end_date)
            
        daily_stats = await query.values('date').annotate(
            total_students=Count('student_id'),
            present_count=Count('id', filter=Q(status='present')),
            late_count=Count('id', filter=Q(status='late')),
            absent_count=Count('id', filter=Q(status='absent')),
            attendance_rate=Avg(
                Case(
                    When(Q(status='present') | Q(status='late'), then=100),
                    When(status='absent', then=0),
                    output_field=FloatField(),
                )
            )
        ).order_by('date')
        
        # 전체 통계
        overall_stats = await query.aggregate(
            total_classes=Count('date', distinct=True),
            total_students=Count('student_id', distinct=True),
            average_attendance=Avg(
                Case(
                    When(Q(status='present') | Q(status='late'), then=100),
                    When(status='absent', then=0),
                    output_field=FloatField(),
                )
            )
        )
        
        return {
            'daily_stats': daily_stats,
            'overall_stats': overall_stats
        }

    @staticmethod
    async def get_instructor_attendance_stats(instructor_id, start_date=None, end_date=None):
        """강사별 수업 출석 통계"""
        query = Attendance.objects.filter(
            dance_class__instructor_id=instructor_id
        )
        
        if start_date:
            query = query.filter(date__gte=start_date)
        if end_date:
            query = query.filter(date__lte=end_date)
            
        class_stats = await query.values(
            'dance_class__name'
        ).annotate(
            total_classes=Count('date', distinct=True),
            total_students=Count('student_id', distinct=True),
            average_attendance=Avg(
                Case(
                    When(Q(status='present') | Q(status='late'), then=100),
                    When(status='absent', then=0),
                    output_field=FloatField(),
                )
            )
        ).order_by('-average_attendance')
        
        return class_stats
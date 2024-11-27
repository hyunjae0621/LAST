# backend/attendance/views/stats_views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..services.stats_service import AttendanceStatsService
from django.utils import timezone
from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def student_attendance_stats(request, student_id):
    """학생 출석 통계 조회"""
    try:
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
        stats = await AttendanceStatsService.get_student_attendance_stats(
            student_id, start_date, end_date
        )
        return Response(stats)
    except ValueError:
        return Response(
            {'error': '날짜 형식이 올바르지 않습니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def class_attendance_stats(request, class_id):
    """수업 출석 통계 조회"""
    try:
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
        stats = await AttendanceStatsService.get_class_attendance_stats(
            class_id, start_date, end_date
        )
        return Response(stats)
    except ValueError:
        return Response(
            {'error': '날짜 형식이 올바르지 않습니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def instructor_attendance_stats(request, instructor_id):
    """강사별 수업 출석 통계 조회"""
    try:
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
        stats = await AttendanceStatsService.get_instructor_attendance_stats(
            instructor_id, start_date, end_date
        )
        return Response(stats)
    except ValueError:
        return Response(
            {'error': '날짜 형식이 올바르지 않습니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
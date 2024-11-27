# backend/accounts/views/analytics_views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..services.analytics_service import StudentAnalyticsService
from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def enrollment_trends(request):
    """수강생 등록 동향 조회"""
    try:
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
        trends = await StudentAnalyticsService.get_enrollment_trends(start_date, end_date)
        return Response(trends)
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
async def retention_analysis(request):
    """수강생 유지율 분석 조회"""
    try:
        months = request.query_params.get('months', 6)
        months = int(months)
        
        analysis = await StudentAnalyticsService.get_retention_analysis(months)
        return Response(analysis)
    except ValueError:
        return Response(
            {'error': '올바르지 않은 개월 수입니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def class_preferences(request):
    """수강생 선호도 분석 조회"""
    try:
        preferences = await StudentAnalyticsService.get_class_preferences()
        return Response(preferences)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def student_behavior(request, student_id):
    """개별 수강생 행동 분석 조회"""
    try:
        behavior = await StudentAnalyticsService.get_student_behavior(student_id)
        return Response(behavior)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
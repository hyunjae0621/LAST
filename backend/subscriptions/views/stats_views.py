# backend/subscriptions/views/stats_views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..services.stats_service import RevenueStatsService
from django.utils import timezone
from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def revenue_summary(request):
    """매출 요약 통계"""
    try:
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
        stats = await RevenueStatsService.get_revenue_summary(
            start_date, end_date
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
async def monthly_revenue(request):
    """월별 매출 통계"""
    try:
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        if year:
            year = int(year)
        if month:
            month = int(month)
            
        stats = await RevenueStatsService.get_monthly_revenue(year, month)
        return Response(stats)
    except ValueError:
        return Response(
            {'error': '년/월 형식이 올바르지 않습니다.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def class_revenue(request, class_id):
    """수업별 매출 통계"""
    try:
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
        stats = await RevenueStatsService.get_class_revenue(
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
async def instructor_revenue(request, instructor_id):
    """강사별 매출 통계"""
    try:
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
        stats = await RevenueStatsService.get_instructor_revenue(
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
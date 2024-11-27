# backend/backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import CustomTokenObtainPairView, register_user, get_user_info
from classes.views import dashboard_stats, todays_classes, DanceClassViewSet
from rest_framework.routers import DefaultRouter
from accounts.views import StudentViewSet
from attendance.views import AttendanceViewSet, MakeupClassViewSet
from subscriptions.views import SubscriptionViewSet
from accounts.views.analytics_views import (
    enrollment_trends,
    retention_analysis,
    class_preferences,
    student_behavior
)




router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'classes', DanceClassViewSet, basename='class')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'makeup', MakeupClassViewSet, basename='makeup')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')


urlpatterns = [
    
    path('admin/', admin.site.urls),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', register_user, name='register'),
    path('api/auth/me/', get_user_info, name='user_info'),
    path('api/dashboard/stats/', dashboard_stats, name='dashboard_stats'),
    path('api/dashboard/today-classes/', todays_classes, name='today_classes'),
    path('api/', include(router.urls)),
    path('api/analytics/enrollment-trends/', enrollment_trends, name='enrollment-trends'),
    path('api/analytics/retention/', retention_analysis, name='retention-analysis'),
    path('api/analytics/class-preferences/', class_preferences, name='class-preferences'),
    path('api/analytics/student-behavior/<int:student_id>/', student_behavior, name='student-behavior'),

]
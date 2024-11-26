# backend/accounts/views.py

from rest_framework import status, viewsets, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, UserSerializer, StudentCreateSerializer, StudentDetailSerializer, StudentListSerializer, StudentProfile
from django.db.models import Count, Avg, Q, Case, When, FloatField
from django.utils import timezone

from django.contrib.auth import get_user_model
from subscriptions.models import Subscription
from attendance.models import Attendance

User = get_user_model()

class StudentViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(user_type='student')
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'phone_number', 'student_profile__emergency_contact']

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentCreateSerializer
        if self.action == 'list':
            return StudentListSerializer
        return StudentDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 활성 수강권 수 계산
        queryset = queryset.annotate(
            active_subscriptions_count=Count(
                'subscription',
                filter=Q(subscription__status='active')
            )
        )
        
        # 출석률 계산 (최근 30일)
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        queryset = queryset.annotate(
            attendance_rate=Avg(
                Case(
                    When(
                        attendance__status='present',
                        attendance__date__gte=thirty_days_ago,
                        then=100
                    ),
                    default=0,
                    output_field=FloatField(),
                )
            )
        )

        return queryset

    @action(detail=True, methods=['get'])
    def subscriptions(self, request, pk=None):
        student = self.get_object()
        subscriptions = student.subscription_set.all()
        from subscriptions.serializers import SubscriptionListSerializer
        return Response(SubscriptionListSerializer(subscriptions, many=True).data)

    @action(detail=True, methods=['get'])
    def attendance_history(self, request, pk=None):
        student = self.get_object()
        attendance = student.attendance_set.all().order_by('-date')
        from attendance.serializers import AttendanceListSerializer
        return Response(AttendanceListSerializer(attendance, many=True).data)
    

    def perform_create(self, serializer):
        user = serializer.save()
        if not hasattr(user, 'student_profile'):
            StudentProfile.objects.create(user=user)

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.student_profile.last_visit = timezone.now()
        instance.student_profile.save()



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': '회원가입이 완료되었습니다.'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_user_info(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
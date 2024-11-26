# backend/accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, StudentProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'phone_number', 'is_active')
    list_filter = ('user_type', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('개인정보', {'fields': ('email', 'phone_number', 'user_type')}),
        ('권한', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone_number', 'user_type', 'password1', 'password2'),
        }),
    )
    search_fields = ('username', 'email', 'phone_number')
    ordering = ('username',)

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'birth_date', 'emergency_contact', 'join_date')
    list_filter = ('gender', 'join_date')
    search_fields = ('user__username', 'user__email', 'emergency_contact')
    raw_id_fields = ('user',)  # user 선택을 위한 검색 인터페이스 추가
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not obj:  # 새로운 프로필 생성 시
            form.base_fields['user'].queryset = User.objects.filter(
                user_type='student'
            ).exclude(
                profile__isnull=False
            ).order_by('username')
        return form
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # 수정 시
            return ['user', 'join_date']
        return ['join_date']

    fieldsets = (
        ('기본 정보', {
            'fields': ('user', 'gender', 'birth_date')
        }),
        ('연락처', {
            'fields': ('emergency_contact', 'address')
        }),
        ('추가 정보', {
            'fields': ('note', 'join_date', 'last_visit')
        })
    )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            # 프로필이 없는 student 타입 유저만 필터링
            existing_profile_users = StudentProfile.objects.values_list('user', flat=True)
            kwargs["queryset"] = User.objects.filter(
                user_type='student'
            ).exclude(
                id__in=existing_profile_users
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
# backend/classes/admin.py

from django.contrib import admin
from .models import DanceClass, ClassSchedule

class ClassScheduleInline(admin.TabularInline):
    model = ClassSchedule
    extra = 1
    min_num = 1
    validate_min = True

@admin.register(DanceClass)
class DanceClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'instructor', 'difficulty', 'capacity', 
                    'current_students_count', 'status', 'created_at')
    list_filter = ('status', 'difficulty', 'instructor')
    search_fields = ('name', 'instructor__username', 'description')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ClassScheduleInline]

    fieldsets = (
        ('기본 정보', {
            'fields': ('name', 'instructor', 'description', 'difficulty')
        }),
        ('수업 설정', {
            'fields': ('capacity', 'price_per_month', 'status')
        }),
        ('등록 정보', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ClassSchedule)
class ClassScheduleAdmin(admin.ModelAdmin):
    list_display = ('dance_class', 'weekday', 'start_time', 'end_time', 'room')
    list_filter = ('weekday', 'dance_class', 'room')
    search_fields = ('dance_class__name', 'room')
    ordering = ('weekday', 'start_time')
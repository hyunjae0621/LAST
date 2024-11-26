# backend/attendance/admin.py

from django.contrib import admin
from .models import Attendance, MakeupClass

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('date', 'student', 'dance_class', 'schedule', 'status')
    list_filter = ('date', 'status', 'dance_class')
    search_fields = ('student__username', 'dance_class__name')
    date_hierarchy = 'date'
    
    fieldsets = (
        ('기본 정보', {
            'fields': ('student', 'dance_class', 'schedule', 'date')
        }),
        ('출결 정보', {
            'fields': ('status', 'memo')
        })
    )

@admin.register(MakeupClass)
class MakeupClassAdmin(admin.ModelAdmin):
    list_display = ('student', 'original_date', 'makeup_date', 'status')
    list_filter = ('status', 'original_date', 'makeup_date')
    search_fields = ('student__username',)
    
    fieldsets = (
        ('신청 정보', {
            'fields': ('student', 'reason')
        }),
        ('수업 정보', {
            'fields': ('original_class', 'makeup_class', 'original_date', 'makeup_date')
        }),
        ('상태', {
            'fields': ('status',)
        })
    )
# backend/classes/admin.py

from django.contrib import admin
from .models import DanceClass, ClassSchedule

class ClassScheduleInline(admin.TabularInline):
    model = ClassSchedule
    extra = 1

@admin.register(DanceClass)
class DanceClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'instructor', 'capacity', 'created_at')
    list_filter = ('instructor',)
    search_fields = ('name', 'instructor__username')
    inlines = [ClassScheduleInline]

@admin.register(ClassSchedule)
class ClassScheduleAdmin(admin.ModelAdmin):
    list_display = ('dance_class', 'weekday', 'start_time', 'end_time')
    list_filter = ('weekday', 'dance_class')
    search_fields = ('dance_class__name',)
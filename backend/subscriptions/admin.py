# backend/subscriptions/admin.py

from django.contrib import admin
from .models import Subscription, SubscriptionPause

class SubscriptionPauseInline(admin.TabularInline):
    model = SubscriptionPause
    extra = 1

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('student', 'dance_class', 'subscription_type', 'status', 
                  'start_date', 'end_date', 'remaining_classes')
    list_filter = ('status', 'subscription_type', 'dance_class')
    search_fields = ('student__username', 'dance_class__name')
    inlines = [SubscriptionPauseInline]
    
    fieldsets = (
        ('기본 정보', {
            'fields': ('student', 'dance_class', 'subscription_type', 'status')
        }),
        ('기간 정보', {
            'fields': ('start_date', 'end_date')
        }),
        ('횟수 정보', {
            'fields': ('total_classes', 'remaining_classes'),
            'classes': ('collapse',)
        })
    )

@admin.register(SubscriptionPause)
class SubscriptionPauseAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'start_date', 'end_date', 'created_at')
    list_filter = ('start_date', 'end_date')
    search_fields = ('subscription__student__username', 'reason')
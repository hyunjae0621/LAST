# backend/subscriptions/admin.py

from django.contrib import admin
from .models import Subscription, SubscriptionPause

class SubscriptionPauseInline(admin.TabularInline):
    model = SubscriptionPause
    extra = 0

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('student', 'dance_class', 'subscription_type', 'status', 
                   'start_date', 'end_date', 'remaining_classes')
    list_filter = ('status', 'subscription_type', 'dance_class')
    search_fields = ('student__username', 'dance_class__name')
    inlines = [SubscriptionPauseInline]
    raw_id_fields = ('student', 'dance_class')
    
    fieldsets = (
        ('기본 정보', {
            'fields': ('student', 'dance_class', 'subscription_type', 'status')
        }),
        ('기간 정보', {
            'fields': ('start_date', 'end_date')
        }),
        ('이용 정보', {
            'fields': ('total_classes', 'remaining_classes')
        }),
        ('결제 정보', {
            'fields': ('price_paid', 'payment_method')
        })
    )

@admin.register(SubscriptionPause)
class SubscriptionPauseAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'start_date', 'end_date', 'created_at')
    list_filter = ('start_date', 'end_date')
    search_fields = ('subscription__student__username', 'reason')
    raw_id_fields = ('subscription',)
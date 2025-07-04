from django.contrib import admin
from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    """Admin interface for Activity model"""
    
    list_display = ['user', 'activity_type', 'description', 'created_at']
    list_filter = ['activity_type', 'created_at']
    search_fields = ['description', 'user__fullName']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Activity Information', {
            'fields': ('user', 'activity_type', 'description', 'metadata')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request)
    
    def has_add_permission(self, request):
        return request.user.is_superuser or request.user.role in ['admin', 'lecturer']
    
    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role in ['admin', 'lecturer']
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role == 'admin'

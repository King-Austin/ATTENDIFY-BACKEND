from django.contrib import admin
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """Admin interface for Course model"""
    
    list_display = ['courseTitle', 'courseCode', 'semester', 'level', 'created_at']
    list_filter = ['semester', 'level', 'created_at']
    search_fields = ['courseTitle', 'courseCode']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Course Information', {
            'fields': ('courseTitle', 'courseCode', 'semester', 'level')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request)
    
    def has_add_permission(self, request):
        return request.user.is_superuser or request.user.role in ['admin', 'lecturer']
    
    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role in ['admin', 'lecturer']
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role == 'admin'

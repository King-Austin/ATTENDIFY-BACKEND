from django.contrib import admin
from .models import AcademicSession


@admin.register(AcademicSession)
class AcademicSessionAdmin(admin.ModelAdmin):
    """Admin interface for Academic Session model"""
    
    list_display = ['name', 'start', 'end', 'active', 'created_at']
    list_filter = ['active', 'start', 'end', 'created_at']
    search_fields = ['name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Session Information', {
            'fields': ('name', 'start', 'end', 'active')
        }),
        ('Semesters', {
            'fields': ('semesters',)
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
        return request.user.is_superuser or request.user.role in ['admin']
    
    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role in ['admin', 'lecturer']
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role == 'admin'

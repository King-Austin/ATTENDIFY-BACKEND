from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    """Admin interface for Student model"""
    
    list_display = ['name', 'regNo', 'level', 'email', 'addmissionYear', 'created_at']
    list_filter = ['level', 'addmissionYear', 'created_at']
    search_fields = ['name', 'regNo', 'email']
    ordering = ['-created_at']
    filter_horizontal = ['course']  # For many-to-many relationship
    
    fieldsets = (
        ('Student Information', {
            'fields': ('name', 'regNo', 'email', 'level', 'addmissionYear')
        }),
        ('Courses', {
            'fields': ('course',)
        }),
        ('Biometric', {
            'fields': ('fingerPrint',),
            'classes': ('collapse',)
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

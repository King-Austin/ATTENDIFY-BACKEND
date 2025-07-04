from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    """Admin interface for Attendance model"""
    
    list_display = ['student', 'course', 'date', 'status', 'lecturer', 'created_at']
    list_filter = ['status', 'date', 'course', 'created_at']
    search_fields = ['student__name', 'student__regNo', 'course__courseTitle', 'course__courseCode']
    ordering = ['-created_at']
    date_hierarchy = 'date'
    
    fieldsets = (
        ('Attendance Information', {
            'fields': ('student', 'course', 'lecturer', 'session', 'date', 'time', 'status')
        }),
        ('Academic Details', {
            'fields': ('semester', 'level'),
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
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "lecturer":
            kwargs["queryset"] = request.user._meta.model.objects.filter(
                role__in=['admin', 'lecturer']
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

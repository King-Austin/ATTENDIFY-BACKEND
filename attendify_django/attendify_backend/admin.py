from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.translation import gettext_lazy as _


class AttendifyAdminSite(AdminSite):
    """Custom admin site for Attendify Backend"""
    
    site_header = _('Attendify Administration')
    site_title = _('Attendify Admin')
    index_title = _('Welcome to Attendify Administration')
    
    def has_permission(self, request):
        """
        Check if the given HttpRequest has permission to view the admin index page.
        """
        return request.user.is_active and (
            request.user.is_superuser or 
            request.user.role in ['admin', 'lecturer']
        )


# Create an instance of our custom admin site
attendify_admin_site = AttendifyAdminSite(name='attendify_admin')


class BaseModelAdmin(admin.ModelAdmin):
    """Base admin class with common functionality"""
    
    def has_add_permission(self, request):
        return request.user.is_superuser or request.user.role in ['admin', 'lecturer']
    
    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role in ['admin', 'lecturer']
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role == 'admin'
    
    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role in ['admin', 'lecturer']


class ReadOnlyModelAdmin(admin.ModelAdmin):
    """Read-only admin for models that should not be edited through admin"""
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
    
    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.role in ['admin', 'lecturer']

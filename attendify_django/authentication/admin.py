from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model"""
    
    list_display = ['email', 'fullName', 'role', 'access', 'emailVerified', 'active', 'date_joined']
    list_filter = ['role', 'access', 'emailVerified', 'active', 'date_joined']
    search_fields = ['email', 'fullName']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('fullName', 'role', 'access')}),
        ('Email verification', {'fields': ('emailVerified', 'emailVerificationCode', 'emailVerificationCodeExpires')}),
        ('Password reset', {'fields': ('passwordResetToken', 'passwordResetTokenExpires')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'active')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'fullName', 'password1', 'password2', 'role', 'access'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login']

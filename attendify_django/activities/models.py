from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Activity(models.Model):
    """Activity model for tracking system activities"""
    
    ACTIVITY_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('register', 'Register'),
        ('attendance_marked', 'Attendance Marked'),
        ('student_added', 'Student Added'),
        ('course_added', 'Course Added'),
        ('user_approved', 'User Approved'),
        ('user_denied', 'User Denied'),
        ('password_changed', 'Password Changed'),
        ('email_verified', 'Email Verified'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField(help_text="Activity description")
    metadata = models.JSONField(default=dict, help_text="Additional activity data")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activities_activity'
        verbose_name = 'Activity'
        verbose_name_plural = 'Activities'
        ordering = ['-created_at']
    
    def __str__(self):
        user_name = self.user.fullName if self.user else "System"
        return f"{user_name} - {self.get_activity_type_display()} - {self.created_at}"

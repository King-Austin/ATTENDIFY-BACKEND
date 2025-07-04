from django.db import models


class AcademicSession(models.Model):
    """Academic Session model based on the Node.js sessionType interface"""
    
    name = models.CharField(max_length=255, help_text="Session name")
    start = models.DateField(help_text="Session start date")
    end = models.DateField(help_text="Session end date")
    semesters = models.JSONField(default=list, help_text="List of semesters")
    active = models.BooleanField(default=False, help_text="Is this session active")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'academic_sessions_academicsession'
        verbose_name = 'Academic Session'
        verbose_name_plural = 'Academic Sessions'
        ordering = ['-start']
    
    def __str__(self):
        return f"{self.name} ({self.start} - {self.end})"

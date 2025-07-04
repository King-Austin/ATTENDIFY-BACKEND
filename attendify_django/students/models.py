from django.db import models
from courses.models import Course


class Student(models.Model):
    """Student model based on the Node.js studentType interface"""
    
    name = models.CharField(max_length=255, help_text="Student name")
    regNo = models.CharField(max_length=50, unique=True, help_text="Registration number")
    level = models.CharField(max_length=20, help_text="Academic level")
    course = models.ManyToManyField(Course, related_name='students', help_text="Enrolled courses")
    fingerPrint = models.TextField(help_text="Fingerprint data")
    addmissionYear = models.CharField(max_length=10, help_text="Admission year")
    email = models.EmailField(help_text="Student email")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'students_student'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['regNo']
    
    def __str__(self):
        return f"{self.regNo} - {self.name}"

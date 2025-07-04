from django.db import models
from django.contrib.auth import get_user_model
from students.models import Student
from courses.models import Course
from academic_sessions.models import AcademicSession

User = get_user_model()


class Attendance(models.Model):
    """Attendance model"""
    
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='attendances')
    lecturer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE, related_name='attendances')
    
    date = models.DateField(help_text="Attendance date")
    time = models.TimeField(help_text="Attendance time")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    
    # Additional fields
    semester = models.CharField(max_length=20, help_text="Semester")
    level = models.CharField(max_length=20, help_text="Academic level")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_attendance'
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendances'
        ordering = ['-date', '-time']
        unique_together = ['student', 'course', 'date']
    
    def __str__(self):
        return f"{self.student.name} - {self.course.courseCode} - {self.date}"

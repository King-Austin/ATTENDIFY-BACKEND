from django.db import models


class Course(models.Model):
    """Course model based on the Node.js courseType interface"""
    
    courseTitle = models.CharField(max_length=255, help_text="Course title")
    courseCode = models.CharField(max_length=20, unique=True, help_text="Course code")
    semester = models.CharField(max_length=20, help_text="Semester")
    level = models.CharField(max_length=20, help_text="Academic level")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'courses_course'
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        ordering = ['courseCode']
    
    def __str__(self):
        return f"{self.courseCode} - {self.courseTitle}"

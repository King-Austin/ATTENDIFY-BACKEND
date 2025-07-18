# Generated by Django 5.2.4 on 2025-07-03 23:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("courses", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Attendance",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateField(help_text="Attendance date")),
                ("time", models.TimeField(help_text="Attendance time")),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("present", "Present"),
                            ("absent", "Absent"),
                            ("late", "Late"),
                        ],
                        default="present",
                        max_length=20,
                    ),
                ),
                ("semester", models.CharField(help_text="Semester", max_length=20)),
                ("level", models.CharField(help_text="Academic level", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="attendances",
                        to="courses.course",
                    ),
                ),
            ],
            options={
                "verbose_name": "Attendance",
                "verbose_name_plural": "Attendances",
                "db_table": "attendance_attendance",
                "ordering": ["-date", "-time"],
            },
        ),
    ]

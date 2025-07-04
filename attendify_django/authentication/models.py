from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import validate_email
import bcrypt
from django.conf import settings
import secrets
from datetime import datetime, timedelta


class User(AbstractUser):
    """Custom User model based on the Node.js userType interface"""
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('lecturer', 'Lecturer'),
        ('user', 'User'),
    ]
    
    ACCESS_CHOICES = [
        ('approved', 'Approved'),
        ('pending', 'Pending'),
        ('denied', 'Denied'),
    ]
    
    # Remove username field since we'll use email for authentication
    username = None
    
    fullName = models.CharField(max_length=255, help_text="Full name of the user")
    email = models.EmailField(unique=True, validators=[validate_email])
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='lecturer')
    access = models.CharField(max_length=20, choices=ACCESS_CHOICES, default='pending')
    
    # Email verification fields
    emailVerified = models.BooleanField(default=False)
    emailVerificationCode = models.IntegerField(null=True, blank=True)
    emailVerificationCodeExpires = models.DateTimeField(null=True, blank=True)
    
    # Password reset fields
    passwordResetToken = models.CharField(max_length=255, null=True, blank=True)
    passwordResetTokenExpires = models.DateTimeField(null=True, blank=True)
    
    # User status
    active = models.BooleanField(default=True)
    
    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullName']
    
    class Meta:
        db_table = 'authentication_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        """Override save method to hash password using bcrypt"""
        if self.password and not self.password.startswith('$2b$'):
            # Hash the password using bcrypt
            salt = bcrypt.gensalt()
            self.password = bcrypt.hashpw(self.password.encode('utf-8'), salt).decode('utf-8')
        super().save(*args, **kwargs)
    
    def check_password(self, raw_password):
        """Check if the provided password matches the stored password"""
        if not self.password:
            return False
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))
    
    def set_password(self, raw_password):
        """Set password using bcrypt"""
        if raw_password:
            salt = bcrypt.gensalt()
            self.password = bcrypt.hashpw(raw_password.encode('utf-8'), salt).decode('utf-8')
    
    def create_reset_password_token(self):
        """Create password reset token"""
        reset_token = secrets.token_hex(32)
        # Hash the token before storing
        salt = bcrypt.gensalt()
        self.passwordResetToken = bcrypt.hashpw(reset_token.encode('utf-8'), salt).decode('utf-8')
        self.passwordResetTokenExpires = datetime.now() + timedelta(minutes=10)
        self.save()
        return reset_token
    
    def verify_reset_token(self, token):
        """Verify password reset token"""
        if not self.passwordResetToken or not self.passwordResetTokenExpires:
            return False
        
        # Check if token has expired
        if datetime.now() > self.passwordResetTokenExpires:
            return False
        
        # Verify token
        return bcrypt.checkpw(token.encode('utf-8'), self.passwordResetToken.encode('utf-8'))
    
    def generate_email_verification_code(self):
        """Generate email verification code"""
        import random
        self.emailVerificationCode = random.randint(100000, 999999)
        self.emailVerificationCodeExpires = datetime.now() + timedelta(minutes=15)
        self.save()
        return self.emailVerificationCode
    
    def verify_email_code(self, code):
        """Verify email verification code"""
        if not self.emailVerificationCode or not self.emailVerificationCodeExpires:
            return False
        
        # Check if code has expired
        if datetime.now() > self.emailVerificationCodeExpires:
            return False
        
        # Verify code
        return self.emailVerificationCode == code

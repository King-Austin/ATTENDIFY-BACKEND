from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_email(subject, recipient_list, message=None, html_message=None):
    """Send email using Django's email backend"""
    try:
        if html_message:
            # If HTML message is provided, create plain text version
            plain_message = strip_tags(html_message) if not message else message
        else:
            plain_message = message
            html_message = None
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_verification_email(user, verification_code):
    """Send email verification code to user"""
    subject = "Email Verification - Attendify"
    message = f"""
    Hello {user.fullName},
    
    Your email verification code is: {verification_code}
    
    This code will expire in 15 minutes.
    
    Best regards,
    Attendify Team
    """
    
    return send_email(subject, [user.email], message)


def send_password_reset_email(user, reset_token):
    """Send password reset email to user"""
    subject = "Password Reset - Attendify"
    reset_url = f"{settings.ORIGIN_URL}/reset-password?token={reset_token}"
    
    message = f"""
    Hello {user.fullName},
    
    You requested to reset your password. Click the link below to reset your password:
    
    {reset_url}
    
    This link will expire in 10 minutes.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    Attendify Team
    """
    
    return send_email(subject, [user.email], message)


def send_approval_email(user):
    """Send approval notification email to user"""
    subject = "Account Approved - Attendify"
    message = f"""
    Hello {user.fullName},
    
    Great news! Your account has been approved and you can now access the Attendify system.
    
    You can login at: {settings.ORIGIN_URL}/login
    
    Best regards,
    Attendify Team
    """
    
    return send_email(subject, [user.email], message)

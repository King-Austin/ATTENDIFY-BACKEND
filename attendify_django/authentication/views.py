from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from django.conf import settings
from datetime import datetime, timedelta

from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer,
    UpdateUserSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    EmailVerificationSerializer
)
from .authentication import create_jwt_token, verify_token_and_get_user
from utils.responses import success_response, error_response, AppError
from utils.email_utils import send_verification_email, send_password_reset_email
from utils.verification_code import generate_email_verification_code

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user (lecturer)"""
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                "Kindly fill in the required field", 
                status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.save()
        
        return success_response(
            "Registration successful! Your account is under review. Once approved, we will send you an email with instructions to access your dashboard.",
            status_code=status.HTTP_201_CREATED
        )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Login user"""
    try:
        serializer = UserLoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                "Please provide the required field", 
                status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return error_response(
                "Invalid email or password. Kindly try again",
                status.HTTP_400_BAD_REQUEST
            )
        
        if not user.check_password(password):
            return error_response(
                "Invalid email or password. Kindly try again",
                status.HTTP_400_BAD_REQUEST
            )
        
        if user.access != "approved":
            return error_response(
                "You are not yet approved to login. Kindly wait for approval",
                status.HTTP_400_BAD_REQUEST
            )
        
        # Create JWT token
        token = create_jwt_token(user)
        
        # Create response
        response = success_response(
            "Login successful.",
            data={'user': UserSerializer(user).data}
        )
        
        # Set JWT cookie
        cookie_expires = datetime.now() + timedelta(days=settings.JWT_COOKIE_EXPIRES)
        response.set_cookie(
            'jwt',
            token,
            expires=cookie_expires,
            httponly=True,
            samesite='None',
            secure=True
        )
        
        return response
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_me(request):
    """Fetch authenticated user information"""
    try:
        user = request.user
        serializer = UserSerializer(user)
        
        return success_response(
            "User fetched successfully",
            data=serializer.data
        )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_user(request):
    """Logout user"""
    try:
        response = success_response("Logged out successfully")
        response.delete_cookie('jwt')
        return response
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_me(request):
    """Update user information"""
    try:
        user = request.user
        serializer = UpdateUserSerializer(user, data=request.data, partial=True)
        
        if not serializer.is_valid():
            return error_response(
                "Invalid data provided",
                status.HTTP_400_BAD_REQUEST
            )
        
        new_email = serializer.validated_data.get('newEmail')
        new_full_name = serializer.validated_data.get('newFullName')
        
        if new_email:
            user.email = new_email
        
        if new_full_name:
            user.fullName = new_full_name
        
        user.save()
        
        return success_response(
            "User information updated successfully",
            data=UserSerializer(user).data
        )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_user_password(request):
    """Change user password"""
    try:
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                "Invalid data provided",
                status.HTTP_400_BAD_REQUEST
            )
        
        current_password = serializer.validated_data['currentPassword']
        new_password = serializer.validated_data['newPassword']
        
        if not user.check_password(current_password):
            return error_response(
                "Current password is incorrect",
                status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        return success_response("Password changed successfully")
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Forgot password"""
    try:
        serializer = ForgotPasswordSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                "Please provide a valid email",
                status.HTTP_400_BAD_REQUEST
            )
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            reset_token = user.create_reset_password_token()
            
            # Send reset email
            send_password_reset_email(user, reset_token)
            
            return success_response(
                "Password reset link sent to your email"
            )
            
        except User.DoesNotExist:
            # Return success even if user doesn't exist for security
            return success_response(
                "Password reset link sent to your email"
            )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([AllowAny])
def reset_password(request):
    """Reset password"""
    try:
        serializer = ResetPasswordSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                "Invalid data provided",
                status.HTTP_400_BAD_REQUEST
            )
        
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['newPassword']
        
        # Find user with this token
        users = User.objects.filter(passwordResetToken__isnull=False)
        user = None
        
        for u in users:
            if u.verify_reset_token(token):
                user = u
                break
        
        if not user:
            return error_response(
                "Invalid or expired reset token",
                status.HTTP_400_BAD_REQUEST
            )
        
        # Reset password
        user.set_password(new_password)
        user.passwordResetToken = None
        user.passwordResetTokenExpires = None
        user.save()
        
        return success_response("Password reset successfully")
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_verification_code(request):
    """Send email verification code"""
    try:
        user = request.user
        
        if user.emailVerified:
            return error_response(
                "Email is already verified",
                status.HTTP_400_BAD_REQUEST
            )
        
        verification_code = user.generate_email_verification_code()
        send_verification_email(user, verification_code)
        
        return success_response("Verification code sent to your email")
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_user_email(request):
    """Verify user email"""
    try:
        user = request.user
        serializer = EmailVerificationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                "Invalid verification code",
                status.HTTP_400_BAD_REQUEST
            )
        
        code = serializer.validated_data['code']
        
        if user.verify_email_code(code):
            user.emailVerified = True
            user.emailVerificationCode = None
            user.emailVerificationCodeExpires = None
            user.save()
            
            return success_response("Email verified successfully")
        else:
            return error_response(
                "Invalid or expired verification code",
                status.HTTP_400_BAD_REQUEST
            )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def make_user_admin(request):
    """Make user admin (admin only)"""
    try:
        # Check if current user is admin
        if request.user.role != 'admin':
            return error_response(
                "You are not authorized to perform this action",
                status.HTTP_403_FORBIDDEN
            )
        
        user_id = request.data.get('userId')
        
        if not user_id:
            return error_response(
                "User ID is required",
                status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(id=user_id)
            user.role = 'admin'
            user.save()
            
            return success_response(
                "User promoted to admin successfully",
                data=UserSerializer(user).data
            )
            
        except User.DoesNotExist:
            return error_response(
                "User not found",
                status.HTTP_404_NOT_FOUND
            )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)

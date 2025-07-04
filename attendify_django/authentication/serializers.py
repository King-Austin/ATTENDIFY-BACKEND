from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import validate_email

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    confirmPassword = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['fullName', 'email', 'password', 'confirmPassword']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate(self, attrs):
        """Validate registration data"""
        password = attrs.get('password')
        confirm_password = attrs.get('confirmPassword')
        
        if password != confirm_password:
            raise serializers.ValidationError("Password and confirm password must be the same.")
        
        return attrs
    
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        validate_email(value)
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "User already exist with this email. If you are the one kindly login."
            )
        
        return value
    
    def create(self, validated_data):
        """Create new user"""
        validated_data.pop('confirmPassword')  # Remove confirmPassword
        user = User.objects.create(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        """Validate login credentials"""
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError("Please provide the required field")
        
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    
    class Meta:
        model = User
        fields = ['id', 'fullName', 'email', 'role', 'access', 'emailVerified', 'active']
        read_only_fields = ['id', 'role', 'access']


class UpdateUserSerializer(serializers.ModelSerializer):
    """Serializer for updating user information"""
    
    newEmail = serializers.EmailField(required=False)
    newFullName = serializers.CharField(max_length=255, required=False)
    
    class Meta:
        model = User
        fields = ['newEmail', 'newFullName']
    
    def validate_newEmail(self, value):
        """Validate new email"""
        if value and User.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Email already exists")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""
    
    currentPassword = serializers.CharField()
    newPassword = serializers.CharField()
    confirmNewPassword = serializers.CharField()
    
    def validate(self, attrs):
        """Validate password change data"""
        new_password = attrs.get('newPassword')
        confirm_new_password = attrs.get('confirmNewPassword')
        
        if new_password != confirm_new_password:
            raise serializers.ValidationError("New password and confirm password must match")
        
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    """Serializer for forgot password"""
    
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for reset password"""
    
    token = serializers.CharField()
    newPassword = serializers.CharField()
    confirmNewPassword = serializers.CharField()
    
    def validate(self, attrs):
        """Validate reset password data"""
        new_password = attrs.get('newPassword')
        confirm_new_password = attrs.get('confirmNewPassword')
        
        if new_password != confirm_new_password:
            raise serializers.ValidationError("New password and confirm password must match")
        
        return attrs


class EmailVerificationSerializer(serializers.Serializer):
    """Serializer for email verification"""
    
    code = serializers.IntegerField()

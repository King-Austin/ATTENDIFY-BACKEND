import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions
from datetime import datetime, timezone

User = get_user_model()


class JWTAuthentication(authentication.BaseAuthentication):
    """Custom JWT Authentication class"""
    
    def authenticate(self, request):
        """Authenticate request using JWT token from cookies"""
        token = self.get_token_from_request(request)
        
        if not token:
            return None
        
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
            user_id = payload.get('id')
            
            if not user_id:
                raise exceptions.AuthenticationFailed('Invalid token')
            
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise exceptions.AuthenticationFailed('User not found')
            
            if not user.active:
                raise exceptions.AuthenticationFailed('User account is deactivated')
            
            return (user, token)
            
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')
    
    def get_token_from_request(self, request):
        """Extract JWT token from request cookies or Authorization header"""
        # First try to get from cookies (matching Node.js implementation)
        token = request.COOKIES.get('jwt')
        
        if not token:
            # Fallback to Authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        return token


def create_jwt_token(user):
    """Create JWT token for user"""
    payload = {
        'id': user.id,
        'email': user.email,
        'exp': datetime.now(timezone.utc) + settings.JWT_EXPIRES_IN,
        'iat': datetime.now(timezone.utc)
    }
    
    return jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')


def verify_token_and_get_user(token):
    """Verify JWT token and return user"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
        user_id = payload.get('id')
        
        if not user_id:
            return None
        
        try:
            user = User.objects.get(id=user_id)
            return user if user.active else None
        except User.DoesNotExist:
            return None
            
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

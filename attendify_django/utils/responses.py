from rest_framework.response import Response
from rest_framework import status


def app_response(status_code, status_text, message, data=None):
    """Create standardized API response matching Node.js structure"""
    response_data = {
        'status': status_text,
        'message': message
    }
    
    if data is not None:
        response_data['data'] = data
    
    return Response(response_data, status=status_code)


def success_response(message, data=None, status_code=status.HTTP_200_OK):
    """Create success response"""
    return app_response(status_code, 'success', message, data)


def error_response(message, status_code=status.HTTP_400_BAD_REQUEST):
    """Create error response"""
    return app_response(status_code, 'error', message)


class AppError(Exception):
    """Custom Application Error class"""
    
    def __init__(self, message, status_code=400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

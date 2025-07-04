from django.http import JsonResponse
from rest_framework import status
import traceback
from django.conf import settings


class ErrorHandlingMiddleware:
    """Custom error handling middleware"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def process_exception(self, request, exception):
        """Handle exceptions globally"""
        if settings.DEBUG:
            # In debug mode, show full traceback
            error_message = str(exception)
            traceback_str = traceback.format_exc()
            print(f"Error: {error_message}")
            print(f"Traceback: {traceback_str}")
        else:
            error_message = "An error occurred. Please try again."
        
        return JsonResponse({
            'status': 'error',
            'message': error_message
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

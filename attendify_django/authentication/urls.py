from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_user, name='logout_user'),
    path('me/', views.fetch_me, name='fetch_me'),
    path('update-me/', views.update_me, name='update_me'),
    path('change-password/', views.change_user_password, name='change_password'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('send-verification-code/', views.send_verification_code, name='send_verification_code'),
    path('verify-email/', views.verify_user_email, name='verify_email'),
    path('make-admin/', views.make_user_admin, name='make_admin'),
]

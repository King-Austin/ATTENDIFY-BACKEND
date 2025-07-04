import random


def generate_email_verification_code():
    """Generate a 6-digit email verification code"""
    return random.randint(100000, 999999)

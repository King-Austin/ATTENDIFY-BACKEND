from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Create initial admin user'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='Admin email')
        parser.add_argument('--password', type=str, help='Admin password')
        parser.add_argument('--name', type=str, help='Admin full name')

    def handle(self, *args, **options):
        email = options.get('email') or 'admin@attendify.com'
        password = options.get('password') or 'admin123'
        name = options.get('name') or 'Administrator'

        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'User with email {email} already exists.')
            )
            return

        user = User.objects.create(
            email=email,
            fullName=name,
            role='admin',
            access='approved',
            is_staff=True,
            is_superuser=True,
            emailVerified=True
        )
        user.set_password(password)
        user.save()

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created admin user: {email} with password: {password}'
            )
        )

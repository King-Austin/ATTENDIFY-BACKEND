# Attendify Django Backend

This is the Django equivalent of the Node.js/TypeScript Attendify backend system. It provides the exact same functionality but implemented using Django and Django REST Framework.

## Features

- **User Authentication**: Registration, login, logout, password reset, email verification
- **JWT Authentication**: Token-based authentication with cookies
- **User Management**: User roles (admin, lecturer, user) and access control
- **Course Management**: CRUD operations for courses
- **Student Management**: Student registration and management
- **Attendance System**: Mark and track attendance
- **Academic Sessions**: Manage academic sessions and semesters
- **Activities Logging**: Track system activities
- **Email Integration**: Email verification and password reset
- **Admin Interface**: Django admin panel for system management

## Project Structure

```
attendify_django/
├── manage.py
├── requirements.txt
├── .env
├── start_server.sh
├── attendify_backend/          # Main project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── authentication/             # User authentication app
│   ├── models.py              # User model
│   ├── views.py               # Authentication views
│   ├── serializers.py         # Data serializers
│   ├── authentication.py      # JWT authentication
│   ├── urls.py                # Authentication URLs
│   └── admin.py               # Admin interface
├── courses/                   # Course management
├── students/                  # Student management
├── attendance/                # Attendance tracking
├── academic_sessions/         # Academic session management
├── activities/                # Activity logging
└── utils/                     # Utility functions
    ├── email_utils.py
    ├── responses.py
    ├── verification_code.py
    └── middleware.py
```

## Installation

1. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Copy the `.env` file and configure your settings:
   ```env
   SECRET_KEY=your-secret-key
   DEBUG=True
   DATABASE_URL=your-mongodb-url
   JWT_SECRET=your-jwt-secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ORIGIN_URL=http://localhost:8080
   ```

4. **Run the setup script:**
   ```bash
   ./start_server.sh
   ```

   Or manually:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py create_admin --email admin@attendify.com --password admin123 --name "Administrator"
   python manage.py runserver 0.0.0.0:8000
   ```

## API Endpoints

### Authentication (`/api/v1/auth/`)
- `POST /register/` - User registration
- `POST /login/` - User login
- `POST /logout/` - User logout
- `GET /me/` - Get current user info
- `PATCH /update-me/` - Update user profile
- `PATCH /change-password/` - Change password
- `POST /forgot-password/` - Request password reset
- `PATCH /reset-password/` - Reset password
- `POST /send-verification-code/` - Send email verification
- `POST /verify-email/` - Verify email
- `PATCH /make-admin/` - Make user admin

### Additional Apps (To be implemented)
- `/api/v1/courses/` - Course management
- `/api/v1/students/` - Student management
- `/api/v1/attendance/` - Attendance tracking
- `/api/v1/academic-sessions/` - Academic sessions
- `/api/v1/activities/` - Activity logs

## Key Features Implementation

### 1. User Model
- Custom user model inheriting from `AbstractUser`
- Email-based authentication
- BCrypt password hashing
- Role-based access control
- Email verification system

### 2. JWT Authentication
- Custom JWT authentication class
- Token generation and verification
- Cookie-based token storage
- Token expiration handling

### 3. API Response Format
- Standardized response format matching Node.js implementation
- Success and error response utilities
- Consistent error handling

### 4. Email Integration
- Email verification codes
- Password reset emails
- SMTP configuration
- HTML and plain text emails

### 5. Database Models
- User model with authentication features
- Course model for academic courses
- Student model with course relationships
- Attendance tracking model
- Academic session management
- Activity logging model

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `fullName`
- `password` (BCrypt hashed)
- `role` (admin, lecturer, user)
- `access` (approved, pending, denied)
- `emailVerified` (Boolean)
- `emailVerificationCode`
- `passwordResetToken`
- Timestamps

### Courses Table
- `id` (Primary Key)
- `courseTitle`
- `courseCode` (Unique)
- `semester`
- `level`
- Timestamps

### Students Table
- `id` (Primary Key)
- `name`
- `regNo` (Unique)
- `level`
- `fingerPrint`
- `addmissionYear`
- `email`
- `course` (Many-to-Many with Courses)
- Timestamps

## Security Features

1. **Password Security**: BCrypt hashing with salt
2. **JWT Security**: Secure token generation and verification
3. **CORS Configuration**: Proper CORS settings
4. **Input Validation**: Comprehensive data validation
5. **Rate Limiting**: Can be added with django-ratelimit
6. **SQL Injection Protection**: Django ORM protection
7. **XSS Protection**: Django's built-in XSS protection

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Accessing Admin Panel
1. Navigate to `http://localhost:8000/admin`
2. Login with admin credentials
3. Manage users, courses, students, etc.

### Adding New Features
1. Create new Django apps: `python manage.py startapp app_name`
2. Add to `INSTALLED_APPS` in settings
3. Create models, views, serializers
4. Add URL patterns
5. Create and run migrations

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | - |
| `DEBUG` | Debug mode | `True` |
| `DATABASE_URL` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration (days) | `20` |
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_USERNAME` | Email username | - |
| `EMAIL_PASSWORD` | Email password | - |
| `ORIGIN_URL` | Frontend URL | `http://localhost:8080` |
| `CLOUDINARY_*` | Cloudinary credentials | - |

## Production Deployment

1. **Update settings for production:**
   - Set `DEBUG=False`
   - Configure `ALLOWED_HOSTS`
   - Use PostgreSQL/MongoDB for production
   - Set up proper logging

2. **Security checklist:**
   - Use HTTPS
   - Set secure cookies
   - Configure CORS properly
   - Use environment variables for secrets
   - Set up monitoring

3. **Deploy to platforms:**
   - Heroku
   - AWS
   - Digital Ocean
   - Railway
   - Render

## Comparison with Node.js Version

| Feature | Node.js | Django |
|---------|---------|---------|
| Language | TypeScript | Python |
| Framework | Express | Django + DRF |
| Database | MongoDB (Mongoose) | SQLite/PostgreSQL (Django ORM) |
| Authentication | JWT + bcryptjs | JWT + bcrypt |
| Email | Nodemailer | Django Email |
| File Upload | Cloudinary | Cloudinary |
| Validation | Manual | DRF Serializers |
| Admin Interface | None | Django Admin |
| API Documentation | Swagger | DRF Browsable API |

## Support

For issues and questions:
1. Check the Django documentation
2. Review the original Node.js implementation
3. Check the error logs
4. Use Django's debug toolbar for development

## License

This project follows the same license as the original Node.js implementation.

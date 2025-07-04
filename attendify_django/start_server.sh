#!/bin/bash

# Django Attendify Backend Setup and Run Script

echo "Starting Django Attendify Backend Setup..."

# Activate virtual environment
source venv/bin/activate

# Check if migrations need to be created
echo "Creating migrations..."
python manage.py makemigrations

# Apply migrations
echo "Applying migrations..."
python manage.py migrate

# Create superuser if it doesn't exist
echo "Creating admin user..."
python manage.py create_admin --email admin@attendify.com --password admin123 --name "Administrator"

# Collect static files (if needed)
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the development server
echo "Starting Django development server..."
echo "Server will be available at: http://localhost:8000"
echo "Admin panel: http://localhost:8000/admin"
echo "API endpoint: http://localhost:8000/api/v1/"
echo ""
echo "Login credentials:"
echo "Email: admin@attendify.com"
echo "Password: admin123"
echo ""

python manage.py runserver 0.0.0.0:8000

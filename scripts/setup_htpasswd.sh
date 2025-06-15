#!/bin/bash

#Change directory to root of project
cd ..

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo ".env file not found!"
    exit 1
fi

# Check if htpasswd is installed
if ! command -v htpasswd &> /dev/null; then
    echo "htpasswd not found. Installing..."
    # Install htpasswd (assuming a Debian-based system)
    sudo apt-get update
    sudo apt-get install -y apache2-utils
else
    echo "htpasswd is already installed."
fi

# Check if NGINX_USER and NGINX_PASSWORD are set in the .env file
if [ -z "$NGINX_USER" ] || [ -z "$NGINX_PASSWORD" ]; then
    echo "NGINX_USER and NGINX_PASSWORD must be set in the .env file."
    exit 1
fi

# Create or update the .htpasswd file
# Use -i to read the password from the command line
echo "$NGINX_PASSWORD" | sudo htpasswd -i -B ./.htpasswd "$NGINX_USER"

echo ".htpasswd file created/updated successfully."

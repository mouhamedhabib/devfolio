FROM php:8.4-fpm

# Install system dependencies needed by Laravel and PostgreSQL driver
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
# pdo_pgsql → PostgreSQL driver for Laravel
# zip       → needed by Composer
RUN docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    zip

# Install Composer from official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Match container user UID with host user UID (1000)
# This prevents permission issues with mounted volumes
RUN usermod -u 1000 www-data && groupmod -g 1000 www-data

WORKDIR /var/www/backend

EXPOSE 9000

# Run PHP-FPM as www-data (UID 1000 = same as host user)
CMD ["php-fpm"]

FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    nano \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    build-essential \
    wget

#RUN apt install php8.1-cli php8.1-json php8.1-mbstring php8.1-xml php8.1-pcov php8.1-xdebug -y

RUN wget -O phpunit.phar https://phar.phpunit.de/phpunit-10.phar && chmod +x phpunit.phar && mv phpunit.phar /usr/local/bin/phpunit

RUN curl -sS https://getcomposer.org/installer -o composer-setup.php \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && composer global require phpunit/phpunit

ENV PATH="$PATH:$HOME/.config/composer/vendor/bin"

# WORKDIR /code

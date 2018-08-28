FROM php:7.2-apache

EXPOSE 80 443

WORKDIR /var/www/app

RUN apt-get update && \
    apt-get install -y zlib1g-dev openssl

RUN docker-php-ext-install mysqli pdo pdo_mysql zip mbstring

RUN mkdir -p /etc/apache2/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/apache2/ssl/server.key \
        -out /etc/apache2/ssl/server.crt \
        -subj "/C=NL/ST=Zuid Holland/L=Rotterdam/O=Sparkling Network/OU=IT Department/CN=ssl.raymii.org"

RUN a2enmod rewrite ssl

RUN echo '\
<VirtualHost *:80>\n\
    DocumentRoot /var/www/app\n\
    ServerAdmin webmaster@localhost\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
    <Directory /var/www/app>\n\
        Options Indexes FollowSymLinks MultiViews\n\
        AllowOverride All\n\
        Allow from all\n\
    </Directory>\n\
</VirtualHost>\n\
' > /etc/apache2/sites-available/000-default.conf

RUN echo '\
<IfModule mod_ssl.c>\n\
    <VirtualHost _default_:443>\n\
        ServerAdmin webmaster@localhost\n\
        DocumentRoot /var/www/app\n\
        ErrorLog ${APACHE_LOG_DIR}/error.log\n\
        CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
        SSLEngine on\n\
        SSLCertificateFile /etc/apache2/ssl/server.crt\n\
        SSLCertificateKeyFile /etc/apache2/ssl/server.key\n\
        <FilesMatch "\\.(cgi|shtml|phtml|php)$">\n\
            SSLOptions +StdEnvVars\n\
        </FilesMatch>\n\
        <Directory /usr/lib/cgi-bin>\n\
            SSLOptions +StdEnvVars\n\
        </Directory>\n\
        <Directory /var/www/app>\n\
            Options Indexes FollowSymLinks MultiViews\n\
            AllowOverride All\n\
            Allow from all\n\
        </Directory>\n\
    </VirtualHost>\n\
</IfModule>\n\
' > /etc/apache2/sites-available/default-ssl.conf

RUN ln -s /etc/apache2/sites-available/default-ssl.conf /etc/apache2/sites-enabled/000-default-ssl.conf

COPY development.ini /usr/local/etc/php/php.ini

COPY public_html /var/www/app

RUN service apache2 restart

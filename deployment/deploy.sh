#!/usr/bin/env bash
# Image Editor - VPS Deployment Script
# Copyright © 2026 Md. Sahabul. All rights reserved.
# Designed & developed by Md. Sahabul.
#
# Run once on a fresh Ubuntu 22.04 VPS:
#   bash deploy.sh

set -euo pipefail

DEPLOY_DIR="/var/www/image-editor"
REPO_URL="https://github.com/YOUR_GITHUB_USERNAME/image-editor.git"
DOMAIN="yourdomain.com"
DB_NAME="image_editor"
DB_USER="image_editor"
DB_PASS="$(openssl rand -base64 18)"
PHP_VER="8.2"

echo "============================================================"
echo " Image Editor — VPS First-Run Setup"
echo " Copyright © 2026 Md. Sahabul. All rights reserved."
echo "============================================================"

# ── System packages ──────────────────────────────────────────────────
apt-get update -qq
apt-get install -y -qq \
    nginx mysql-server redis-server supervisor git curl unzip \
    php${PHP_VER}-fpm php${PHP_VER}-cli php${PHP_VER}-mysql \
    php${PHP_VER}-mbstring php${PHP_VER}-xml php${PHP_VER}-zip \
    php${PHP_VER}-gd php${PHP_VER}-bcmath php${PHP_VER}-redis \
    python3.11 python3.11-venv certbot python3-certbot-nginx nodejs npm

# ── Composer ────────────────────────────────────────────────────────
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ── MySQL: create DB and user ────────────────────────────────────────
mysql -u root <<SQL
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL
echo "MySQL DB created. Password: ${DB_PASS}"

# ── Clone repo ───────────────────────────────────────────────────────
if [ ! -d "$DEPLOY_DIR" ]; then
    git clone "$REPO_URL" "$DEPLOY_DIR"
fi

# ── Backend .env ─────────────────────────────────────────────────────
cd "${DEPLOY_DIR}/backend"
cp .env.example .env
sed -i "s|APP_URL=.*|APP_URL=https://${DOMAIN}|"        .env
sed -i "s|DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|"        .env
sed -i "s|DB_USERNAME=.*|DB_USERNAME=${DB_USER}|"        .env
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|"        .env
sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://${DOMAIN}|" .env

composer install --no-dev --optimize-autoloader --no-interaction
php artisan key:generate
php artisan migrate --seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ── AI service venv ──────────────────────────────────────────────────
cd "${DEPLOY_DIR}/ai-service"
python3.11 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

# ── Nginx ────────────────────────────────────────────────────────────
cp "${DEPLOY_DIR}/deployment/nginx.conf" /etc/nginx/sites-available/image-editor
sed -i "s|yourdomain.com|${DOMAIN}|g" /etc/nginx/sites-available/image-editor
ln -sf /etc/nginx/sites-available/image-editor /etc/nginx/sites-enabled/image-editor
nginx -t && systemctl reload nginx

# ── SSL (Let's Encrypt) ──────────────────────────────────────────────
certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "admin@${DOMAIN}" || true

# ── Supervisor ───────────────────────────────────────────────────────
cp "${DEPLOY_DIR}/deployment/supervisor-worker.conf" /etc/supervisor/conf.d/image-editor.conf
supervisorctl reread && supervisorctl update && supervisorctl start image-editor-worker:*
supervisorctl start image-editor-ai || true

# ── Permissions ──────────────────────────────────────────────────────
chown -R www-data:www-data "${DEPLOY_DIR}"
chmod -R 775 "${DEPLOY_DIR}/backend/storage" "${DEPLOY_DIR}/backend/bootstrap/cache"

echo ""
echo "✅  Deployment complete!"
echo "   Site:       https://${DOMAIN}"
echo "   DB password: ${DB_PASS}  (save this!)"

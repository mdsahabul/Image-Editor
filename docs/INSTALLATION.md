# Image Editor — Installation Guide
<!-- 
Image Editor
Copyright © 2026 Md. Sahabul. All rights reserved.
Designed & developed by Md. Sahabul.
-->

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| PHP  | 8.2 |
| Composer | 2.x |
| Node.js | 18+ |
| MySQL | 8.0 |
| Redis | 6+ |
| Python | 3.10+ |

---

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/image-editor.git
cd image-editor
```

---

## 2. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your database credentials:

```env
DB_DATABASE=image_editor
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
REDIS_HOST=127.0.0.1
AI_SERVICE_URL=http://127.0.0.1:8001
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourStrongAdminPassword!
```

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve   # runs on http://localhost:8000
```

---

## 3. Queue worker (separate terminal)

```bash
cd backend
php artisan queue:work --sleep=3 --tries=3
```

---

## 4. Frontend (React)

```bash
cd frontend
cp .env.example .env
npm install
npm start   # runs on http://localhost:3000
```

---

## 5. AI Service (Python)

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Download the Real-ESRGAN model:

```bash
wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth \
     -O models/RealESRGAN_x4plus.pth
```

Start the service:

```bash
uvicorn main:app --host 127.0.0.1 --port 8001
```

The rembg model (U²-Net) downloads automatically on first use.

---

## 6. Docker (quickest local start)

```bash
cd deployment
docker-compose up --build
```

Visit http://localhost:3000 — login with the admin credentials from `.env`.

---

## 7. Production (VPS)

See `deployment/deploy.sh` for a full automated setup script for Ubuntu 22.04.

Required GitHub Secrets for CI/CD (Settings → Secrets → Actions):

| Secret | Value |
|--------|-------|
| `VPS_HOST` | Your server IP or hostname |
| `VPS_USER` | SSH username (e.g. `ubuntu`) |
| `VPS_SSH_KEY` | Private SSH key content |
| `VPS_PORT` | SSH port (default `22`) |
| `REACT_APP_API_BASE_URL` | `https://yourdomain.com/api` |

---

## 8. First login

- URL: `http://localhost:3000` (dev) or `https://yourdomain.com` (prod)
- Email: value of `ADMIN_EMAIL` in `.env`
- Password: value of `ADMIN_PASSWORD` in `.env`

---

© 2026 Md. Sahabul. All rights reserved. Designed & developed by Md. Sahabul.

# Image Editor — Testing Guide
<!--
Image Editor
Copyright © 2026 Md. Sahabul. All rights reserved.
Designed & developed by Md. Sahabul.
-->

## Backend (PHPUnit)

```bash
cd backend

# Create test database first
mysql -u root -e "CREATE DATABASE IF NOT EXISTS image_editor_test;"

# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage

# Run a specific suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run a specific test file
php artisan test tests/Feature/Auth/AuthTest.php

# Run tests in parallel (faster)
php artisan test --parallel
```

Test suites included:

| Suite | File | Tests |
|-------|------|-------|
| Auth | `tests/Feature/Auth/AuthTest.php` | Register, login, logout, profile |
| Projects | `tests/Feature/Project/ProjectTest.php` | CRUD, duplicate, ownership |
| Admin | `tests/Feature/Admin/AdminAccessTest.php` | RBAC, user management |

---

## Frontend (React Testing Library)

```bash
cd frontend
npm test              # watch mode
npm test -- --watchAll=false   # single run (CI)
```

---

## API Smoke Test (curl)

```bash
# Register
curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@t.com","password":"Password1","password_confirmation":"Password1"}' | jq .

# Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"t@t.com","password":"Password1"}' | jq -r '.data.token')

# Create project
curl -s -X POST http://localhost:8000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Smoke Test Project","canvas_width":1920,"canvas_height":1080}' | jq .

# AI service health
curl http://localhost:8001/health
```

---

© 2026 Md. Sahabul. All rights reserved. Designed & developed by Md. Sahabul.

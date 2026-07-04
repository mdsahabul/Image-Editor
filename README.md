<!--
Image Editor
Copyright © 2026 Md. Sahabul. All rights reserved.
Designed & developed by Md. Sahabul.
-->

# Image Editor

> **Proprietary software. All rights reserved.**
> © 2026 Md. Sahabul. No part of this software may be copied, modified, redistributed, resold, or published without the written permission of Md. Sahabul.

A full-featured, production-quality web-based image editing SaaS built with Laravel, React, Fabric.js, and local open-source AI models.

---

## ✨ Features

- 🎨 **Non-destructive canvas editor** — Fabric.js layers, undo/redo, text, shapes, brush
- 🖼️ **Image uploads** — drag & drop, quota management, thumbnail generation
- ✂️ **Crop tool** — Cropper.js integration
- 🎛️ **Filters** — OpenCV.js CLAHE, brightness, contrast, blur, sharpen (in-browser)
- 🤖 **AI Tools (all local, no paid APIs)**
  - Background removal — U²-Net via `rembg`
  - Super-resolution upscaling — Real-ESRGAN ×2/×4
  - Auto-enhance — OpenCV CLAHE + white balance
- 📤 **Export** — PNG, JPG, WebP, PDF (server-rendered, full quality)
- 📁 **Folder organisation** — nested project folders
- 👤 **Authentication** — Sanctum token auth, password reset
- 🛡️ **Admin panel** — user management, queue monitor, app settings, stats dashboard
- 📊 **Queue jobs** — Redis-backed async processing (uploads, AI, exports)

---

## 🗂️ Structure

```
image-editor/
├── backend/          # Laravel 10 REST API
├── frontend/         # React 18 SPA
├── ai-service/       # Python FastAPI AI microservice
├── deployment/       # Nginx, Supervisor, Docker, deploy script
├── docs/             # API reference, installation, testing
└── .github/          # CI/CD workflows
```

---

## 🚀 Quick Start

See [docs/INSTALLATION.md](docs/INSTALLATION.md) for the full guide.

**Docker (fastest):**
```bash
cd deployment
docker-compose up --build
# Open http://localhost:3000
```

---

## 🔗 GitHub → VPS Auto-Deploy

Push to `main` → GitHub Actions runs tests → deploys to your VPS automatically.

Add these secrets to your GitHub repo (**Settings → Secrets → Actions**):

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | Server IP / hostname |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | Private SSH key |
| `VPS_PORT` | SSH port (default 22) |
| `REACT_APP_API_BASE_URL` | `https://yourdomain.com/api` |

---

## 📖 Docs

- [Installation](docs/INSTALLATION.md)
- [API Reference](docs/API.md)
- [Testing](docs/TESTING.md)

---

© 2026 Md. Sahabul. All rights reserved. Designed & developed by Md. Sahabul.

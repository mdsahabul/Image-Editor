# Image Editor — REST API Reference
<!--
Image Editor
Copyright © 2026 Md. Sahabul. All rights reserved.
Designed & developed by Md. Sahabul.
-->

Base URL: `https://yourdomain.com/api`

All authenticated requests require:
```
Authorization: Bearer <token>
Accept: application/json
```

---

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns token |
| POST | `/auth/logout` | Revoke current token |
| POST | `/auth/logout-all` | Revoke all tokens |
| POST | `/auth/forgot-password` | Send reset link |
| POST | `/auth/reset-password` | Reset with token |
| GET  | `/me` | Get authenticated user |
| PUT  | `/profile` | Update name/avatar |
| PUT  | `/password` | Change password |

---

## Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/projects` | List projects (paginated) |
| POST   | `/projects` | Create project |
| GET    | `/projects/{id}` | Get project with layers |
| PUT    | `/projects/{id}` | Update project |
| DELETE | `/projects/{id}` | Soft-delete project |
| POST   | `/projects/{id}/duplicate` | Duplicate project |

---

## Layers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/projects/{id}/layers` | List all layers |
| POST   | `/projects/{id}/layers` | Create layer |
| PUT    | `/projects/{id}/layers/{lid}` | Update layer |
| DELETE | `/projects/{id}/layers/{lid}` | Delete layer |
| POST   | `/projects/{id}/layers/reorder` | Reorder (pass `layer_ids[]`) |
| POST   | `/projects/{id}/versions` | Save version snapshot |
| POST   | `/projects/{id}/versions/{vid}/restore` | Restore version |

---

## Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/images` | List uploaded images |
| POST   | `/images` | Upload image (multipart) |
| GET    | `/images/{id}` | Get image details |
| DELETE | `/images/{id}` | Delete image |

---

## AI Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/images/{id}/ai/remove-background` | Queue bg removal |
| POST   | `/images/{id}/ai/upscale` | Queue upscale (param: `scale=2|4`) |
| POST   | `/images/{id}/ai/auto-enhance` | Queue auto-enhance |
| GET    | `/ai-jobs/{jobId}` | Poll AI job status |

All AI endpoints return `{ ai_job_id, status: "queued" }` immediately. Poll `/ai-jobs/{id}` until `status === "completed"` to get `result_url`.

---

## Exports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/projects/{id}/exports` | List exports |
| POST   | `/projects/{id}/exports` | Queue export render |
| GET    | `/projects/{id}/exports/{eid}` | Poll export status |

---

## Admin (role: admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/admin/stats` | Dashboard metrics |
| GET    | `/admin/users` | List all users |
| GET    | `/admin/users/{id}` | Get user |
| PUT    | `/admin/users/{id}` | Update user |
| DELETE | `/admin/users/{id}` | Delete user |
| POST   | `/admin/users/{id}/toggle-active` | Activate/deactivate |
| GET    | `/admin/settings` | Get app settings |
| PUT    | `/admin/settings` | Update settings |
| GET    | `/admin/queue/stats` | Queue statistics |
| GET    | `/admin/queue/failed` | Failed jobs list |
| POST   | `/admin/queue/failed/{id}/retry` | Retry failed job |
| DELETE | `/admin/queue/failed/{id}` | Delete failed job |

---

## Response envelope

All responses follow:
```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

Errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": { "field": ["message"] }
}
```

---

© 2026 Md. Sahabul. All rights reserved. Designed & developed by Md. Sahabul.

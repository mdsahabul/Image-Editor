# Image Editor
# Copyright © 2026 Md. Sahabul. All rights reserved.
# Designed & developed by Md. Sahabul.

"""
Local AI inference microservice for Image Editor.
Runs entirely on-premises — no external API calls, no data shared.

Models used:
  - Background removal : rembg (U²-Net, MIT licensed)
  - Upscaling          : Real-ESRGAN (BSD-3-Clause)
  - Auto-enhance       : OpenCV CLAHE + histogram equalisation
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import bg_removal, upscale, enhance

app = FastAPI(
    title="Image Editor — AI Service",
    description="Local open-source AI inference. © 2026 Md. Sahabul. All rights reserved.",
    version="1.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bg_removal.router, prefix="/bg-removal", tags=["Background Removal"])
app.include_router(upscale.router,    prefix="/upscale",    tags=["Upscale"])
app.include_router(enhance.router,    prefix="/enhance",    tags=["Auto Enhance"])


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "Image Editor AI Service"}

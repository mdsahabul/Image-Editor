# Image Editor
# Copyright © 2026 Md. Sahabul. All rights reserved.
# Designed & developed by Md. Sahabul.

"""
Background removal router.
Uses rembg which bundles the U²-Net model (MIT licensed).
Model is downloaded automatically on first use to ~/.u2net/
"""

import io
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response
from PIL import Image
from rembg import remove

router = APIRouter()


@router.post("/remove", summary="Remove image background (U²-Net)")
async def remove_background(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=422, detail="Uploaded file must be an image.")

    data = await file.read()
    if len(data) > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 50 MB).")

    try:
        # rembg.remove returns PNG bytes with transparent background
        result_bytes = remove(data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Background removal failed: {exc}")

    return Response(content=result_bytes, media_type="image/png")

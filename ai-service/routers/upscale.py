# Image Editor
# Copyright © 2026 Md. Sahabul. All rights reserved.
# Designed & developed by Md. Sahabul.

"""
Image upscaling router.
Uses Real-ESRGAN (BSD-3-Clause, by Xintao Wang et al.).
Download RealESRGAN_x4plus.pth to ai-service/models/ before first use:
  wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth \
       -O ai-service/models/RealESRGAN_x4plus.pth
"""

import io
import os
import numpy as np
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response
from PIL import Image

router = APIRouter()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "RealESRGAN_x4plus.pth")
_upsampler = None   # Lazy-load to avoid 10-second startup delay


def _get_upsampler(scale: int = 4):
    global _upsampler
    if _upsampler is not None:
        return _upsampler
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(
            f"Real-ESRGAN model not found at {MODEL_PATH}. "
            "Download it with: wget https://github.com/xinntao/Real-ESRGAN/"
            "releases/download/v0.1.0/RealESRGAN_x4plus.pth -O ai-service/models/RealESRGAN_x4plus.pth"
        )
    try:
        from basicsr.archs.rrdbnet_arch import RRDBNet
        from realesrgan import RealESRGANer

        model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64,
                        num_block=23, num_grow_ch=32, scale=4)
        _upsampler = RealESRGANer(
            scale=4,
            model_path=MODEL_PATH,
            model=model,
            tile=512,
            tile_pad=10,
            pre_pad=0,
            half=False,
        )
    except Exception as e:
        raise RuntimeError(f"Failed to load Real-ESRGAN: {e}")
    return _upsampler


@router.post("/run", summary="Upscale image with Real-ESRGAN")
async def upscale_image(
    file: UploadFile = File(...),
    scale: int = Form(2, ge=1, le=4),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=422, detail="Uploaded file must be an image.")

    data = await file.read()
    try:
        img_pil = Image.open(io.BytesIO(data)).convert("RGB")
        img_np  = np.array(img_pil)

        upsampler = _get_upsampler(4)
        output_np, _ = upsampler.enhance(img_np, outscale=scale)

        out_img = Image.fromarray(output_np)
        buf = io.BytesIO()
        out_img.save(buf, format="PNG")
        buf.seek(0)

        return Response(content=buf.read(), media_type="image/png")

    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Upscale failed: {exc}")

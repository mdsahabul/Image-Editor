# Image Editor
# Copyright © 2026 Md. Sahabul. All rights reserved.
# Designed & developed by Md. Sahabul.

"""
Auto-enhance router.
Uses OpenCV CLAHE (Contrast Limited Adaptive Histogram Equalisation)
plus mild white-balance correction — no ML model required.
"""

import io
import numpy as np
import cv2
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response
from PIL import Image

router = APIRouter()


def auto_enhance(img_np: np.ndarray) -> np.ndarray:
    """
    Apply CLAHE to L channel of LAB colour space, then mild auto white-balance.
    Returns enhanced BGR numpy array.
    """
    # Convert to LAB
    lab = cv2.cvtColor(img_np, cv2.COLOR_BGR2LAB)
    l_ch, a_ch, b_ch = cv2.split(lab)

    # CLAHE on luminance
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l_ch = clahe.apply(l_ch)

    # Merge back
    lab  = cv2.merge([l_ch, a_ch, b_ch])
    enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

    # Auto white-balance via simple grey-world assumption
    result = enhanced.astype(np.float64)
    avg_b  = np.mean(result[:, :, 0])
    avg_g  = np.mean(result[:, :, 1])
    avg_r  = np.mean(result[:, :, 2])
    avg    = (avg_b + avg_g + avg_r) / 3

    result[:, :, 0] = np.clip(result[:, :, 0] * (avg / avg_b), 0, 255)
    result[:, :, 1] = np.clip(result[:, :, 1] * (avg / avg_g), 0, 255)
    result[:, :, 2] = np.clip(result[:, :, 2] * (avg / avg_r), 0, 255)

    return result.astype(np.uint8)


@router.post("/auto", summary="Auto-enhance image (CLAHE + white balance)")
async def auto_enhance_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=422, detail="Uploaded file must be an image.")

    data = await file.read()
    try:
        img_pil = Image.open(io.BytesIO(data)).convert("RGB")
        img_np  = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

        enhanced = auto_enhance(img_np)

        # Encode back to JPEG
        ok, buf = cv2.imencode(".jpg", enhanced, [cv2.IMWRITE_JPEG_QUALITY, 92])
        if not ok:
            raise RuntimeError("JPEG encoding failed.")

        return Response(content=buf.tobytes(), media_type="image/jpeg")

    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Auto-enhance failed: {exc}")

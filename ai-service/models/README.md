# AI Models Directory
# Image Editor — Copyright © 2026 Md. Sahabul. All rights reserved.

Place model weight files here before starting the AI service.

## Required model files

### Real-ESRGAN (for upscaling)
Download `RealESRGAN_x4plus.pth` (BSD-3-Clause licence):

```bash
wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth \
     -O ai-service/models/RealESRGAN_x4plus.pth
```

### rembg / U²-Net (for background removal)
rembg downloads the U²-Net model automatically on first use to `~/.u2net/u2net.onnx`.
No manual action required.

### OpenCV (for auto-enhance)
OpenCV is installed via pip. No model files needed.

<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Services;

use Intervention\Image\Facades\Image;
use Intervention\Image\Image as InterventionImage;

class ImageProcessingService
{
    public function load(string $absolutePath): InterventionImage
    {
        return Image::make($absolutePath);
    }

    public function crop(InterventionImage $image, int $width, int $height, int $x, int $y): InterventionImage
    {
        return $image->crop($width, $height, $x, $y);
    }

    public function resize(InterventionImage $image, ?int $width, ?int $height, bool $maintainAspect = true): InterventionImage
    {
        return $image->resize($width, $height, function ($constraint) use ($maintainAspect) {
            if ($maintainAspect) {
                $constraint->aspectRatio();
            }
            $constraint->upsize();
        });
    }

    public function rotate(InterventionImage $image, float $degrees): InterventionImage
    {
        return $image->rotate(-$degrees); // Intervention rotates counter-clockwise by default
    }

    public function flip(InterventionImage $image, string $direction = 'h'): InterventionImage
    {
        return $image->flip($direction);
    }

    public function brightness(InterventionImage $image, int $level): InterventionImage
    {
        return $image->brightness($level); // -100 to 100
    }

    public function contrast(InterventionImage $image, int $level): InterventionImage
    {
        return $image->contrast($level); // -100 to 100
    }

    public function grayscale(InterventionImage $image): InterventionImage
    {
        return $image->greyscale();
    }

    public function sepia(InterventionImage $image): InterventionImage
    {
        return $image->greyscale()->brightness(-10)->contrast(10);
    }

    public function blur(InterventionImage $image, int $amount): InterventionImage
    {
        return $image->blur($amount); // 0 to 100
    }

    public function sharpen(InterventionImage $image, int $amount): InterventionImage
    {
        return $image->sharpen($amount); // 0 to 100
    }

    /**
     * Apply a chain of filters defined by a layer's style_json["filters"] array.
     * Example filters payload: [{ "type": "brightness", "value": 20 }, { "type": "blur", "value": 5 }]
     */
    public function applyFilterChain(InterventionImage $image, array $filters): InterventionImage
    {
        foreach ($filters as $filter) {
            $type = $filter['type'] ?? null;
            $value = $filter['value'] ?? 0;

            $image = match ($type) {
                'brightness' => $this->brightness($image, (int) $value),
                'contrast' => $this->contrast($image, (int) $value),
                'grayscale' => $this->grayscale($image),
                'sepia' => $this->sepia($image),
                'blur' => $this->blur($image, (int) $value),
                'sharpen' => $this->sharpen($image, (int) $value),
                default => $image,
            };
        }

        return $image;
    }

    public function encodeAndSave(InterventionImage $image, string $absolutePath, string $format = 'jpg', int $quality = 90): void
    {
        $image->encode($format, $quality)->save($absolutePath);
    }
}

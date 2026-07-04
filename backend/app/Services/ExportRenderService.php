<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Services;

use App\Models\Project;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;

/**
 * Renders a Project's layer stack into a single flattened raster image.
 * This is the server-side equivalent of what the React canvas (Fabric.js/
 * Konva.js) shows the user live, ensuring full-quality, reproducible exports
 * even for very large canvases that should not be rendered in-browser.
 */
class ExportRenderService
{
    public function __construct(
        protected ImageProcessingService $imageProcessor,
        protected string $disk = 'public'
    ) {
    }

    public function render(Project $project, string $format = 'png', int $quality = 90, ?int $targetWidth = null, ?int $targetHeight = null): InterventionCanvasResult
    {
        $canvas = Image::canvas($project->canvas_width, $project->canvas_height, $project->background_color);

        $layers = $project->layers()->where('is_visible', true)->orderBy('z_index')->with('imageAsset')->get();

        foreach ($layers as $layer) {
            $this->compositeLayer($canvas, $layer);
        }

        if ($targetWidth || $targetHeight) {
            $canvas->resize($targetWidth, $targetHeight, function ($constraint) {
                $constraint->aspectRatio();
            });
        }

        $encoded = $canvas->encode($format, $quality);

        return new InterventionCanvasResult((string) $encoded, $canvas->width(), $canvas->height());
    }

    protected function compositeLayer($canvas, $layer): void
    {
        $transform = $layer->transform_json ?? [];
        $x = (int) ($transform['x'] ?? 0);
        $y = (int) ($transform['y'] ?? 0);

        if ($layer->type === 'image' && $layer->imageAsset) {
            $absolutePath = Storage::disk($layer->imageAsset->disk)->path($layer->imageAsset->original_path);
            $layerImage = Image::make($absolutePath);

            $scaleX = (float) ($transform['scaleX'] ?? 1);
            $scaleY = (float) ($transform['scaleY'] ?? 1);

            if ($scaleX !== 1.0 || $scaleY !== 1.0) {
                $layerImage->resize(
                    (int) ($layerImage->width() * $scaleX),
                    (int) ($layerImage->height() * $scaleY)
                );
            }

            if (! empty($layer->style_json['filters'])) {
                $layerImage = $this->imageProcessor->applyFilterChain($layerImage, $layer->style_json['filters']);
            }

            if (($transform['rotation'] ?? 0) != 0) {
                $layerImage->rotate(-$transform['rotation']);
            }

            $opacity = (int) round(($layer->opacity ?? 1) * 100);

            $canvas->insert($layerImage, 'top-left', $x, $y, $opacity);
        }

        // Text and shape layers are rendered by the React canvas at export
        // time via a flattened PNG sent from the client for vector-accurate
        // text rendering; this service focuses on raster image compositing.
    }
}

/**
 * Lightweight value object returned by ExportRenderService::render().
 */
class InterventionCanvasResult
{
    public function __construct(
        public readonly string $binaryContents,
        public readonly int $width,
        public readonly int $height
    ) {
    }
}

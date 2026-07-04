<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * HTTP client for the local, open-source AI inference microservice
 * (ai-service/, FastAPI). No external/paid APIs are ever called from here.
 */
class AiInferenceClient
{
    protected string $baseUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('imageeditor.ai_service.url'), '/');
        $this->timeout = config('imageeditor.ai_service.timeout', 120);
    }

    public function removeBackground(string $absoluteImagePath): string
    {
        return $this->postFile('/bg-removal/remove', $absoluteImagePath);
    }

    public function upscale(string $absoluteImagePath, int $scale = 2): string
    {
        return $this->postFile('/upscale/run', $absoluteImagePath, ['scale' => $scale]);
    }

    public function autoEnhance(string $absoluteImagePath): string
    {
        return $this->postFile('/enhance/auto', $absoluteImagePath);
    }

    public function healthCheck(): bool
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/health");

            return $response->successful();
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Posts an image file (multipart) to the AI service and returns
     * the raw binary contents of the resulting processed image.
     */
    protected function postFile(string $endpoint, string $absoluteImagePath, array $extraParams = []): string
    {
        $response = Http::timeout($this->timeout)
            ->attach('file', file_get_contents($absoluteImagePath), basename($absoluteImagePath))
            ->post("{$this->baseUrl}{$endpoint}", $extraParams);

        if (! $response->successful()) {
            throw new RuntimeException(
                "AI service request to {$endpoint} failed: HTTP {$response->status()} - {$response->body()}"
            );
        }

        return $response->body();
    }
}

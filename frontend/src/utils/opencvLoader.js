/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

let loaded  = false;
let loading = false;
const callbacks = [];

/**
 * Lazily loads OpenCV.js from jsDelivr CDN (WASM build).
 * Calls `onReady` once cv is available on window.cv.
 * Safe to call multiple times — only inserts the script once.
 */
export function loadOpenCV(onReady) {
    if (loaded) { onReady(); return; }
    callbacks.push(onReady);
    if (loading) return;

    loading = true;

    window.Module = {
        onRuntimeInitialized() {
            loaded  = true;
            loading = false;
            callbacks.forEach(cb => cb());
        },
    };

    const script = document.createElement('script');
    script.async = true;
    // OpenCV.js 4.x WASM build via jsDelivr (MIT licensed, bundled separately)
    script.src = 'https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.9.0-release.1/dist/opencv.js';
    script.onerror = () => {
        console.error('Failed to load OpenCV.js');
        loading = false;
    };
    document.head.appendChild(script);
}

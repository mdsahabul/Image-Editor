/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

/**
 * Fit the canvas into the available viewport maintaining aspect ratio.
 * Returns the best zoom level to use.
 */
export function calcFitZoom(canvasWidth, canvasHeight, viewportWidth, viewportHeight, padding = 80) {
    const availW = viewportWidth  - padding;
    const availH = viewportHeight - padding;
    const zoomW  = availW / canvasWidth;
    const zoomH  = availH / canvasHeight;
    return Math.min(zoomW, zoomH, 1);
}

/**
 * Convert a dataURL to a Blob object (for upload).
 */
export function dataURLToBlob(dataURL) {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: mime });
}

/**
 * Serialize a Fabric.js canvas JSON, excluding properties not needed server-side.
 */
export function serializeCanvas(fabricCanvas) {
    return fabricCanvas.toJSON(['data', 'selectable', 'evented']);
}

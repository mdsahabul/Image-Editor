/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_MB = Number(process.env.REACT_APP_MAX_UPLOAD_MB || 25);

export function validateImageFile(file) {
    const errors = [];
    if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`File type "${file.type}" is not supported. Please upload JPEG, PNG, WebP, or GIF.`);
    }
    if (file.size > MAX_MB * 1024 * 1024) {
        errors.push(`File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds the ${MAX_MB} MB limit.`);
    }
    return errors;
}

export function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 B';
    const k    = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i    = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import aiApi from '../../api/aiApi';
import { toast } from 'react-toastify';

export default function AiPanel() {
    const { layers, selectedLayerId, fabricRef, setShowAiPanel } = useEditor();
    const [busy, setBusy] = useState(null);

    const selectedLayer = layers.find(l => l.id === selectedLayerId);
    const assetId = selectedLayer?.image_asset_id;

    const pollJob = async (jobId) => {
        for (let i = 0; i < 60; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const res = await aiApi.jobStatus(jobId);
            const { status, result_url } = res.data.data;
            if (status === 'completed') return result_url;
            if (status === 'failed')   throw new Error('AI job failed on server.');
        }
        throw new Error('AI job timed out.');
    };

    const runAi = async (type, apiFn, label) => {
        if (!assetId) { toast.warning('Select an image layer first.'); return; }
        setBusy(type);
        const toastId = toast.loading(`${label} — queued…`);
        try {
            const res = await apiFn(assetId);
            const jobId = res.data.data.ai_job_id;
            toast.update(toastId, { render: `${label} — processing…` });
            const resultUrl = await pollJob(jobId);
            toast.update(toastId, { render: `${label} done! Adding to canvas…`, type: 'success', isLoading: false, autoClose: 3000 });

            // Add result image to canvas
            const canvas = fabricRef.current;
            if (canvas && resultUrl) {
                const { fabric } = require('fabric');
                fabric.Image.fromURL(resultUrl, (img) => {
                    img.set({ left: 50, top: 50 });
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                }, { crossOrigin: 'anonymous' });
            }
        } catch (e) {
            toast.update(toastId, { render: e.message || `${label} failed.`, type: 'error', isLoading: false, autoClose: 4000 });
        } finally {
            setBusy(null);
        }
    };

    const actions = [
        {
            key:   'bg_removal',
            label: 'Remove Background',
            icon:  'bi-magic',
            desc:  'Removes the background using U²-Net (local model, no API key needed).',
            fn:    () => runAi('bg_removal', aiApi.removeBackground, 'Background Removal'),
        },
        {
            key:   'upscale',
            label: 'Upscale ×2',
            icon:  'bi-arrows-fullscreen',
            desc:  'Enhances resolution with Real-ESRGAN (runs locally).',
            fn:    () => runAi('upscale', (id) => aiApi.upscale(id, 2), 'Upscale'),
        },
        {
            key:   'enhance',
            label: 'Auto Enhance',
            icon:  'bi-brightness-high',
            desc:  'Auto-adjusts brightness, contrast & sharpness (OpenCV-based).',
            fn:    () => runAi('enhance', aiApi.autoEnhance, 'Auto Enhance'),
        },
    ];

    return (
        <div className="ie-properties" style={{ zIndex: 10 }}>
            <div className="ie-properties-section d-flex justify-content-between align-items-center">
                <span className="ie-properties-section-title mb-0"><i className="bi bi-stars me-1" />AI Tools</span>
                <button className="btn-close btn-close-white btn-sm" onClick={() => setShowAiPanel(false)} />
            </div>

            {!selectedLayer && (
                <div className="ie-properties-section text-secondary small">
                    <i className="bi bi-info-circle me-1" /> Select an image layer to use AI tools.
                </div>
            )}

            {actions.map(({ key, label, icon, desc, fn }) => (
                <div key={key} className="ie-properties-section">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <i className={`bi ${icon} text-primary`} style={{ fontSize: '1.1rem' }} />
                        <span style={{ fontSize: '.88rem', fontWeight: 600 }}>{label}</span>
                    </div>
                    <p className="text-secondary mb-2" style={{ fontSize: '.75rem' }}>{desc}</p>
                    <button
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={fn}
                        disabled={!!busy || !assetId}
                    >
                        {busy === key ? <><span className="spinner-border spinner-border-sm me-1" />Processing…</> : label}
                    </button>
                </div>
            ))}

            <div className="ie-properties-section small text-muted">
                <i className="bi bi-shield-lock me-1" />All AI models run locally on the server — no external API calls, no data shared.
            </div>
        </div>
    );
}

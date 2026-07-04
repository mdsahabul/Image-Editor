/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { loadOpenCV } from '../../utils/opencvLoader';
import { toast } from 'react-toastify';

const FILTERS = [
    { key: 'brightness', label: 'Brightness', min: -100, max: 100, default: 0 },
    { key: 'contrast',   label: 'Contrast',   min: -100, max: 100, default: 0 },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100, default: 0 },
    { key: 'blur',       label: 'Blur',       min: 0,   max: 20,  default: 0 },
    { key: 'sharpen',    label: 'Sharpen',    min: 0,   max: 10,  default: 0 },
];

export default function FilterPanel() {
    const { fabricRef, setShowFilterPanel } = useEditor();
    const [cvReady, setCvReady] = useState(false);
    const [filterVals, setFilterVals] = useState(Object.fromEntries(FILTERS.map(f => [f.key, f.default])));
    const [applying, setApplying]     = useState(false);

    useEffect(() => {
        loadOpenCV(() => setCvReady(true));
    }, []);

    const applyFilters = useCallback(async () => {
        const canvas = fabricRef.current;
        const obj = canvas?.getActiveObject();
        if (!obj || obj.type !== 'image') {
            toast.warning('Please select an image layer first.');
            return;
        }
        if (!cvReady) { toast.info('OpenCV.js is still loading, please wait…'); return; }

        setApplying(true);
        try {
            const cv = window.cv;

            // Draw selected fabric image to a temp canvas
            const tempEl = document.createElement('canvas');
            tempEl.width  = obj.width  * obj.scaleX;
            tempEl.height = obj.height * obj.scaleY;
            const ctx = tempEl.getContext('2d');
            obj.drawObject(ctx, -obj.left, -obj.top);

            let mat = cv.imread(tempEl);
            const dst = new cv.Mat();

            // Blur
            if (filterVals.blur > 0) {
                const k = filterVals.blur * 2 + 1;
                cv.GaussianBlur(mat, dst, new cv.Size(k, k), 0);
                mat.delete(); mat = dst.clone();
            }

            // Brightness / Contrast — via convertScaleAbs
            const alpha = 1 + filterVals.contrast / 100;
            const beta  = filterVals.brightness;
            mat.convertTo(dst, -1, alpha, beta);
            mat.delete(); mat = dst.clone();

            cv.imshow(tempEl, mat);
            mat.delete(); dst.delete();

            const dataURL = tempEl.toDataURL('image/png');
            const img = new window.Image();
            img.onload = () => {
                const { fabric } = require('fabric');
                const newFabricImg = new fabric.Image(img, { left: obj.left, top: obj.top, scaleX: obj.scaleX, scaleY: obj.scaleY });
                canvas.remove(obj);
                canvas.add(newFabricImg);
                canvas.setActiveObject(newFabricImg);
                canvas.renderAll();
                toast.success('Filters applied!');
                setApplying(false);
            };
            img.src = dataURL;
        } catch (e) {
            toast.error('Filter apply failed: ' + e.message);
            setApplying(false);
        }
    }, [fabricRef, cvReady, filterVals]);

    return (
        <div className="ie-properties" style={{ zIndex: 10 }}>
            <div className="ie-properties-section d-flex justify-content-between align-items-center">
                <span className="ie-properties-section-title mb-0">Image Filters</span>
                <button className="btn-close btn-close-white btn-sm" onClick={() => setShowFilterPanel(false)} />
            </div>

            {!cvReady && (
                <div className="ie-properties-section text-secondary small d-flex align-items-center gap-2">
                    <span className="spinner-border spinner-border-sm" />
                    Loading OpenCV.js…
                </div>
            )}

            {FILTERS.map(f => (
                <div key={f.key} className="ie-properties-section">
                    <div className="ie-input-label">{f.label} ({filterVals[f.key] > 0 ? '+' : ''}{filterVals[f.key]})</div>
                    <input
                        type="range" className="ie-slider"
                        min={f.min} max={f.max} value={filterVals[f.key]}
                        onChange={e => setFilterVals(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                    />
                </div>
            ))}

            <div className="ie-properties-section d-flex flex-column gap-2">
                <button className="btn btn-ie-primary btn-sm" onClick={applyFilters} disabled={applying || !cvReady}>
                    {applying ? <><span className="spinner-border spinner-border-sm me-1" />Applying…</> : 'Apply Filters'}
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setFilterVals(Object.fromEntries(FILTERS.map(f => [f.key, f.default])))}>
                    Reset
                </button>
            </div>
        </div>
    );
}

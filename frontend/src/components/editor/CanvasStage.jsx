/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { useCanvas } from '../../hooks/useCanvas';
import imageApi from '../../api/imageApi';
import { toast } from 'react-toastify';

export default function CanvasStage({ project }) {
    const { zoom, layers, fabricRef, setSelectedLayerId } = useEditor();
    const { addImageFromUrl } = useCanvas('fabric-canvas');
    const wrapperRef = useRef(null);

    // Load existing layers into canvas when project/layers load
    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas || !layers.length) return;

        layers.forEach((layer) => {
            if (layer.type === 'image' && layer.image?.url) {
                addImageFromUrl(layer.image.url, {
                    left: layer.transform?.x || 0,
                    top:  layer.transform?.y || 0,
                    scaleX: layer.transform?.scaleX || 1,
                    scaleY: layer.transform?.scaleY || 1,
                    angle: layer.transform?.rotation || 0,
                    opacity: layer.opacity ?? 1,
                    data: { layerId: layer.id },
                });
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layers]);

    // Track active object → selected layer
    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const onSelection = (e) => {
            const obj = e.selected?.[0];
            setSelectedLayerId(obj?.data?.layerId || null);
        };
        canvas.on('selection:created', onSelection);
        canvas.on('selection:updated', onSelection);
        canvas.on('selection:cleared', () => setSelectedLayerId(null));

        return () => {
            canvas.off('selection:created', onSelection);
            canvas.off('selection:updated', onSelection);
        };
    }, [fabricRef, setSelectedLayerId]);

    // Drag-and-drop image file onto canvas
    const onDrop = useCallback(async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) { toast.error('Please drop an image file.'); return; }

        const uploadToast = toast.loading('Uploading image…');
        try {
            const res = await imageApi.upload(file, project?.id);
            const asset = res.data.data;
            // Poll until ready
            let ready = asset;
            for (let i = 0; i < 10 && ready.status !== 'ready'; i++) {
                await new Promise(r => setTimeout(r, 1500));
                const poll = await imageApi.get(asset.id);
                ready = poll.data.data;
            }
            toast.update(uploadToast, { render: 'Image added to canvas!', type: 'success', isLoading: false, autoClose: 2000 });
            addImageFromUrl(ready.url || ready.thumbnail_url, { data: { assetId: ready.id } });
        } catch {
            toast.update(uploadToast, { render: 'Upload failed.', type: 'error', isLoading: false, autoClose: 3000 });
        }
    }, [project, addImageFromUrl]);

    const onDragOver = (e) => e.preventDefault();

    const canvasStyle = {
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        display: 'block',
    };

    return (
        <div
            className="ie-canvas-area"
            onDrop={onDrop}
            onDragOver={onDragOver}
            ref={wrapperRef}
        >
            <div className="ie-canvas-wrapper" ref={wrapperRef}>
                <div style={canvasStyle}>
                    <canvas id="fabric-canvas" />
                </div>
            </div>
        </div>
    );
}

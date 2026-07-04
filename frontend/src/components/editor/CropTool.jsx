/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useEditor } from '../../context/EditorContext';
import { toast } from 'react-toastify';

export default function CropTool() {
    const { fabricRef, setShowCropTool, pushUndo, markDirty } = useEditor();
    const cropperRef = useRef(null);
    const [src, setSrc] = React.useState(null);
    const [originalObj, setOriginalObj] = React.useState(null);

    React.useEffect(() => {
        const canvas = fabricRef.current;
        const obj = canvas?.getActiveObject();
        if (!obj || obj.type !== 'image') {
            toast.warning('Select an image layer to crop.');
            setShowCropTool(false);
            return;
        }
        setOriginalObj(obj);
        const dataURL = obj.toDataURL({ format: 'png', quality: 1 });
        setSrc(dataURL);
    }, [fabricRef, setShowCropTool]);

    const applyCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (!cropper) return;

        const croppedDataURL = cropper.getCroppedCanvas().toDataURL('image/png');
        const canvas = fabricRef.current;

        const { fabric } = require('fabric');
        const img = new window.Image();
        img.onload = () => {
            const newImg = new fabric.Image(img, {
                left: originalObj.left,
                top:  originalObj.top,
                scaleX: 1,
                scaleY: 1,
            });
            canvas.remove(originalObj);
            canvas.add(newImg);
            canvas.setActiveObject(newImg);
            canvas.renderAll();
            pushUndo(JSON.stringify(canvas.toJSON()));
            markDirty();
            toast.success('Crop applied!');
            setShowCropTool(false);
        };
        img.src = croppedDataURL;
    };

    if (!src) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.85)', zIndex: 2000 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content bg-dark text-light border-secondary">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title"><i className="bi bi-crop me-2" />Crop Image</h5>
                        <button className="btn-close btn-close-white" onClick={() => setShowCropTool(false)} />
                    </div>
                    <div className="modal-body" style={{ maxHeight: '65vh', overflow: 'hidden' }}>
                        <Cropper
                            ref={cropperRef}
                            src={src}
                            style={{ width: '100%', maxHeight: '60vh' }}
                            viewMode={1}
                            guides={true}
                            background={false}
                            movable={true}
                            zoomable={true}
                        />
                    </div>
                    <div className="modal-footer border-secondary">
                        <button className="btn btn-secondary" onClick={() => setShowCropTool(false)}>Cancel</button>
                        <button className="btn btn-ie-primary" onClick={applyCrop}>Apply Crop</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

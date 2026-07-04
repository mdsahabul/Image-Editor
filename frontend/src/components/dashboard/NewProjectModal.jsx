/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import { toast } from 'react-toastify';

const PRESETS = [
    { label: 'HD 1920×1080', width: 1920, height: 1080 },
    { label: 'Square 1080×1080', width: 1080, height: 1080 },
    { label: 'Portrait 1080×1350', width: 1080, height: 1350 },
    { label: '4K 3840×2160', width: 3840, height: 2160 },
    { label: 'A4 Print (px)', width: 2480, height: 3508 },
    { label: 'Custom', width: null, height: null },
];

export default function NewProjectModal({ show, onClose, folderId }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState('Untitled Project');
    const [preset, setPreset] = useState(0);
    const [customW, setCustomW] = useState(1920);
    const [customH, setCustomH] = useState(1080);
    const [bg, setBg] = useState('#ffffff');
    const [loading, setLoading] = useState(false);

    const selectedPreset = PRESETS[preset];
    const width  = selectedPreset.width  || customW;
    const height = selectedPreset.height || customH;

    const handleCreate = async () => {
        setLoading(true);
        try {
            const res = await projectApi.create({
                title, canvas_width: width, canvas_height: height,
                background_color: bg, folder_id: folderId || null,
            });
            toast.success('Project created!');
            onClose();
            navigate(`/editor/${res.data.data.id}`);
        } catch {
            toast.error('Could not create project.');
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-light border-secondary">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title"><i className="bi bi-plus-square me-2" />New Project</h5>
                        <button className="btn-close btn-close-white" onClick={onClose} />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label small text-secondary">Project Name</label>
                            <input className="form-control bg-black text-light border-secondary" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small text-secondary">Canvas Size</label>
                            <select className="form-select bg-black text-light border-secondary" value={preset} onChange={e => setPreset(+e.target.value)}>
                                {PRESETS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                            </select>
                        </div>
                        {selectedPreset.width === null && (
                            <div className="row g-2 mb-3">
                                <div className="col">
                                    <label className="form-label small text-secondary">Width (px)</label>
                                    <input type="number" className="form-control bg-black text-light border-secondary" value={customW} onChange={e => setCustomW(+e.target.value)} />
                                </div>
                                <div className="col">
                                    <label className="form-label small text-secondary">Height (px)</label>
                                    <input type="number" className="form-control bg-black text-light border-secondary" value={customH} onChange={e => setCustomH(+e.target.value)} />
                                </div>
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label small text-secondary">Background Color</label>
                            <div className="d-flex align-items-center gap-2">
                                <input type="color" className="form-control form-control-color border-secondary" value={bg} onChange={e => setBg(e.target.value)} style={{ width: 46, padding: 2 }} />
                                <span className="small text-secondary">{bg}</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-secondary">
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-ie-primary" onClick={handleCreate} disabled={loading || !title.trim()}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                            Create Project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

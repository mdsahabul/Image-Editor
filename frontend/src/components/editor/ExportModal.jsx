/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useState } from 'react';
import exportApi from '../../api/exportApi';
import { toast } from 'react-toastify';

const FORMATS = ['png', 'jpg', 'webp', 'pdf'];

export default function ExportModal({ project, onClose }) {
    const [format,  setFormat]  = useState('png');
    const [quality, setQuality] = useState(90);
    const [width,   setWidth]   = useState('');
    const [height,  setHeight]  = useState('');
    const [busy,    setBusy]    = useState(false);
    const [poll,    setPoll]    = useState(null);

    const triggerExport = async () => {
        setBusy(true);
        try {
            const res = await exportApi.create(project.id, {
                format, quality,
                width:  width  ? +width  : undefined,
                height: height ? +height : undefined,
            });
            const exportId = res.data.data.id;
            toast.info('Export queued — will notify when ready.');

            // Poll for completion
            const interval = setInterval(async () => {
                try {
                    const r = await exportApi.get(project.id, exportId);
                    const exp = r.data.data;
                    setPoll(exp);
                    if (exp.status === 'completed') {
                        clearInterval(interval);
                        setBusy(false);
                        toast.success('Export ready!');
                    }
                    if (exp.status === 'failed') {
                        clearInterval(interval);
                        setBusy(false);
                        toast.error('Export failed: ' + exp.error_message);
                    }
                } catch { clearInterval(interval); setBusy(false); }
            }, 2500);
        } catch {
            toast.error('Could not start export.');
            setBusy(false);
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.75)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-light border-secondary">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title"><i className="bi bi-box-arrow-up me-2" />Export Project</h5>
                        <button className="btn-close btn-close-white" onClick={onClose} />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label text-secondary small">Format</label>
                            <div className="d-flex gap-2 flex-wrap">
                                {FORMATS.map(f => (
                                    <button key={f} className={`btn btn-sm ${format === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setFormat(f)}>
                                        .{f.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(format === 'jpg' || format === 'webp') && (
                            <div className="mb-3">
                                <label className="form-label text-secondary small">Quality ({quality}%)</label>
                                <input type="range" className="ie-slider" min={1} max={100} value={quality}
                                    onChange={e => setQuality(+e.target.value)} />
                            </div>
                        )}

                        <div className="row g-2 mb-3">
                            <div className="col">
                                <label className="form-label text-secondary small">Width (px, optional)</label>
                                <input type="number" className="form-control bg-black text-light border-secondary"
                                    placeholder={project.canvas_width} value={width} onChange={e => setWidth(e.target.value)} />
                            </div>
                            <div className="col">
                                <label className="form-label text-secondary small">Height (px, optional)</label>
                                <input type="number" className="form-control bg-black text-light border-secondary"
                                    placeholder={project.canvas_height} value={height} onChange={e => setHeight(e.target.value)} />
                            </div>
                        </div>

                        {poll?.status === 'completed' && (
                            <div className="alert alert-success d-flex align-items-center gap-2">
                                <i className="bi bi-check-circle-fill" />
                                <div>
                                    Export ready!{' '}
                                    <a href={poll.download_url} download className="alert-link">Download</a>
                                    {poll.size_bytes && <span className="text-muted ms-2 small">({(poll.size_bytes / 1024).toFixed(0)} KB)</span>}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer border-secondary">
                        <button className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button className="btn btn-ie-primary" onClick={triggerExport} disabled={busy}>
                            {busy ? <><span className="spinner-border spinner-border-sm me-1" />Exporting…</> : 'Export'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

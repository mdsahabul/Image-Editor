/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { useHistory } from '../../hooks/useHistory';
import ExportModal from './ExportModal';
import layerApi from '../../api/layerApi';
import { toast } from 'react-toastify';

export default function ToolbarTop({ project }) {
    const { isDirty, markClean, fabricRef, zoom, setZoom } = useEditor();
    const { undo, redo, canUndo, canRedo } = useHistory();
    const [saving, setSaving]   = useState(false);
    const [showExport, setShowExport] = useState(false);

    const handleSave = async () => {
        const canvas = fabricRef.current;
        if (!canvas || !project) return;
        setSaving(true);
        try {
            const json = canvas.toJSON();
            await layerApi.saveVersion(project.id, 'autosave');
            markClean();
            toast.success('Project saved!', { autoClose: 1500 });
        } catch {
            toast.error('Save failed.');
        } finally {
            setSaving(false);
        }
    };

    const zoomIn  = () => setZoom(z => Math.min(z + 0.1, 4));
    const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.1));
    const zoomReset = () => setZoom(1);

    return (
        <>
            <div className="ie-toolbar-top">
                <span className="ie-project-name me-4">{project?.title || 'Untitled'}</span>

                {isDirty && <span className="badge bg-warning text-dark me-2" style={{ fontSize: '.7rem' }}>Unsaved</span>}

                <div className="d-flex gap-1 me-3">
                    <button className="ie-tool-btn" onClick={undo} disabled={!canUndo()} title="Undo (Ctrl+Z)">
                        <i className="bi bi-arrow-counterclockwise" />
                    </button>
                    <button className="ie-tool-btn" onClick={redo} disabled={!canRedo()} title="Redo (Ctrl+Shift+Z)">
                        <i className="bi bi-arrow-clockwise" />
                    </button>
                </div>

                <div className="d-flex align-items-center gap-1 me-3">
                    <button className="ie-tool-btn" onClick={zoomOut} title="Zoom Out"><i className="bi bi-zoom-out" /></button>
                    <button className="btn btn-sm btn-dark" onClick={zoomReset} style={{ minWidth: 56, fontSize: '.78rem' }}>
                        {Math.round(zoom * 100)}%
                    </button>
                    <button className="ie-tool-btn" onClick={zoomIn} title="Zoom In"><i className="bi bi-zoom-in" /></button>
                </div>

                <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={handleSave} disabled={saving || !isDirty}>
                        {saving ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="bi bi-cloud-upload me-1" />}
                        Save
                    </button>
                    <button className="btn btn-ie-primary btn-sm" onClick={() => setShowExport(true)}>
                        <i className="bi bi-box-arrow-up me-1" />Export
                    </button>
                </div>
            </div>

            {showExport && <ExportModal project={project} onClose={() => setShowExport(false)} />}
        </>
    );
}

/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import { toast } from 'react-toastify';

export default function ProjectCard({ project, onDeleted, onDuplicated }) {
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);

    const open = () => navigate(`/editor/${project.id}`);

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
        setBusy(true);
        try {
            await projectApi.remove(project.id);
            toast.success('Project deleted.');
            onDeleted(project.id);
        } catch { toast.error('Could not delete project.'); }
        finally { setBusy(false); }
    };

    const handleDuplicate = async (e) => {
        e.stopPropagation();
        setBusy(true);
        try {
            const res = await projectApi.duplicate(project.id);
            toast.success('Project duplicated.');
            onDuplicated(res.data.data);
        } catch { toast.error('Could not duplicate project.'); }
        finally { setBusy(false); }
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="ie-project-card" onClick={open}>
            <div className="ie-project-thumb">
                {project.thumbnail_url
                    ? <img src={project.thumbnail_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <i className="bi bi-image" />
                }
            </div>
            <div className="ie-project-info d-flex align-items-start justify-content-between gap-1">
                <div style={{ minWidth: 0 }}>
                    <div className="ie-project-title">{project.title}</div>
                    <div className="ie-project-meta">{project.canvas_width}×{project.canvas_height} · {timeAgo(project.updated_at)}</div>
                </div>
                <div className="dropdown" onClick={e => e.stopPropagation()}>
                    <button className="btn btn-sm btn-dark" data-bs-toggle="dropdown" disabled={busy}>
                        <i className="bi bi-three-dots-vertical" />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                        <li><button className="dropdown-item" onClick={open}><i className="bi bi-pencil me-2" />Open</button></li>
                        <li><button className="dropdown-item" onClick={handleDuplicate}><i className="bi bi-copy me-2" />Duplicate</button></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger" onClick={handleDelete}><i className="bi bi-trash me-2" />Delete</button></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

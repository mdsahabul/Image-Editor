/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useCallback, useEffect, useState } from 'react';
import projectApi from '../../api/projectApi';
import ProjectCard from './ProjectCard';
import Loader from '../common/Loader';
import NewProjectModal from './NewProjectModal';
import { toast } from 'react-toastify';

export default function ProjectGrid({ folderId }) {
    const [projects, setProjects]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [showModal, setShowModal]   = useState(false);
    const [page, setPage]             = useState(1);
    const [lastPage, setLastPage]     = useState(1);

    const fetchProjects = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const res = await projectApi.list({ folder_id: folderId || undefined, search: search || undefined, page: p });
            const { items, pagination } = res.data.data;
            setProjects(p === 1 ? items : prev => [...prev, ...items]);
            setLastPage(pagination.last_page);
            setPage(p);
        } catch { toast.error('Could not load projects.'); }
        finally { setLoading(false); }
    }, [folderId, search]);

    useEffect(() => { fetchProjects(1); }, [fetchProjects]);

    const handleDeleted  = (id)  => setProjects(prev => prev.filter(p => p.id !== id));
    const handleDuplicated = (p) => setProjects(prev => [p, ...prev]);

    return (
        <div>
            <div className="d-flex align-items-center gap-2 mb-4">
                <input
                    className="form-control bg-dark text-light border-secondary"
                    style={{ maxWidth: 280 }}
                    placeholder="Search projects…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button className="btn btn-ie-primary ms-auto" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-lg me-2" />New Project
                </button>
            </div>

            {loading && projects.length === 0 ? <Loader /> : (
                <>
                    {projects.length === 0 ? (
                        <div className="text-center py-5 text-secondary">
                            <i className="bi bi-folder2-open" style={{ fontSize: '3rem' }} />
                            <p className="mt-3">No projects yet. Create your first one!</p>
                            <button className="btn btn-ie-primary" onClick={() => setShowModal(true)}>
                                <i className="bi bi-plus-lg me-2" />New Project
                            </button>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {projects.map(p => (
                                <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <ProjectCard project={p} onDeleted={handleDeleted} onDuplicated={handleDuplicated} />
                                </div>
                            ))}
                        </div>
                    )}

                    {page < lastPage && (
                        <div className="text-center mt-4">
                            <button className="btn btn-outline-secondary" onClick={() => fetchProjects(page + 1)} disabled={loading}>
                                {loading ? 'Loading…' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}

            <NewProjectModal show={showModal} onClose={() => setShowModal(false)} folderId={folderId} />
        </div>
    );
}

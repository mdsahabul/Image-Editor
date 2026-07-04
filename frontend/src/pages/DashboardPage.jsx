/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProjectGrid from '../components/dashboard/ProjectGrid';
import { useAuth } from '../context/AuthContext';
import projectApi from '../api/projectApi';
import { toast } from 'react-toastify';

export default function DashboardPage() {
    const { user } = useAuth();
    const [folders, setFolders]         = useState([]);
    const [activeFolderId, setActiveFolder] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [creatingFolder, setCreatingFolder] = useState(false);

    useEffect(() => {
        projectApi.listFolders()
            .then(r => setFolders(r.data.data))
            .catch(() => {});
    }, []);

    const createFolder = async () => {
        if (!newFolderName.trim()) return;
        setCreatingFolder(true);
        try {
            const res = await projectApi.createFolder({ name: newFolderName.trim() });
            setFolders(prev => [...prev, res.data.data]);
            setNewFolderName('');
            toast.success('Folder created.');
        } catch { toast.error('Could not create folder.'); }
        finally { setCreatingFolder(false); }
    };

    const deleteFolder = async (folder) => {
        if (!window.confirm(`Delete folder "${folder.name}"?`)) return;
        try {
            await projectApi.removeFolder(folder.id);
            setFolders(prev => prev.filter(f => f.id !== folder.id));
            if (activeFolderId === folder.id) setActiveFolder(null);
            toast.success('Folder deleted.');
        } catch { toast.error('Could not delete folder.'); }
    };

    const storagePercent = user?.storage_used_percent ?? 0;

    return (
        <>
            <Navbar />
            <div className="ie-dashboard d-flex gap-0" style={{ minHeight: 'calc(100vh - 52px - 48px)', padding: 0 }}>
                {/* Sidebar */}
                <aside style={{ width: 220, background: 'var(--ie-dark)', borderRight: '1px solid var(--ie-panel-border)', padding: '1.25rem 0', flexShrink: 0 }}>
                    <div className="px-3 mb-3">
                        <div className="small text-secondary mb-1 fw-bold">STORAGE</div>
                        <div className="progress" style={{ height: 6, background: '#2d3451' }}>
                            <div
                                className={`progress-bar bg-${storagePercent > 85 ? 'danger' : storagePercent > 60 ? 'warning' : 'primary'}`}
                                style={{ width: `${storagePercent}%` }}
                            />
                        </div>
                        <div className="small text-secondary mt-1">
                            {((user?.storage_used_bytes || 0) / 1024 / 1024).toFixed(1)} MB / {user?.storage_quota_mb} MB
                        </div>
                    </div>

                    <hr style={{ borderColor: 'var(--ie-panel-border)' }} />

                    <button
                        className={`w-100 text-start px-3 py-2 border-0 bg-transparent text-${activeFolderId === null ? 'white' : 'secondary'}`}
                        onClick={() => setActiveFolder(null)}
                        style={{ fontSize: '.88rem', background: activeFolderId === null ? 'rgba(79,70,229,.15)' : 'transparent' }}
                    >
                        <i className="bi bi-grid me-2" />All Projects
                    </button>

                    <div className="px-3 mt-3 mb-1">
                        <div className="small text-secondary fw-bold">FOLDERS</div>
                    </div>

                    {folders.map(f => (
                        <div
                            key={f.id}
                            className={`d-flex align-items-center px-3 py-2 ${activeFolderId === f.id ? 'text-white' : 'text-secondary'}`}
                            style={{ cursor: 'pointer', fontSize: '.87rem', background: activeFolderId === f.id ? 'rgba(79,70,229,.15)' : 'transparent' }}
                            onClick={() => setActiveFolder(f.id)}
                        >
                            <i className="bi bi-folder me-2" />
                            <span className="flex-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                            <button
                                className="btn btn-sm p-0 ms-1 text-secondary border-0 bg-transparent"
                                style={{ fontSize: '.8rem' }}
                                onClick={e => { e.stopPropagation(); deleteFolder(f); }}
                                title="Delete folder"
                            >
                                <i className="bi bi-x" />
                            </button>
                        </div>
                    ))}

                    <div className="px-3 mt-3">
                        <div className="input-group input-group-sm">
                            <input
                                className="form-control bg-dark text-light border-secondary"
                                placeholder="New folder…"
                                value={newFolderName}
                                onChange={e => setNewFolderName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && createFolder()}
                            />
                            <button className="btn btn-outline-secondary" onClick={createFolder} disabled={creatingFolder || !newFolderName.trim()}>
                                <i className="bi bi-plus" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                    <ProjectGrid folderId={activeFolderId} />
                </main>
            </div>
            <Footer />
        </>
    );
}

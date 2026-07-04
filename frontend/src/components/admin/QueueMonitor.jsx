/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';

export default function QueueMonitor() {
    const [stats,  setStats]  = useState(null);
    const [failed, setFailed] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sRes, fRes] = await Promise.all([adminApi.queueStats(), adminApi.failedJobs()]);
            setStats(sRes.data.data);
            setFailed(fRes.data.data);
        } catch { toast.error('Could not load queue data.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const retry = async (id) => {
        try {
            await adminApi.retryJob(id);
            toast.success('Job re-queued.');
            fetchData();
        } catch { toast.error('Retry failed.'); }
    };

    const forget = async (id) => {
        if (!window.confirm('Remove this failed job permanently?')) return;
        try {
            await adminApi.forgetJob(id);
            setFailed(prev => prev.filter(j => j.id !== id));
            toast.success('Job removed.');
        } catch { toast.error('Could not remove job.'); }
    };

    if (loading) return <Loader />;

    return (
        <div>
            {/* Stats row */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="ie-stat-card">
                        <div className="ie-stat-value text-warning">{stats?.pending_jobs ?? 0}</div>
                        <div className="ie-stat-label">Pending Jobs</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="ie-stat-card">
                        <div className="ie-stat-value text-danger">{stats?.failed_jobs ?? 0}</div>
                        <div className="ie-stat-label">Failed Jobs</div>
                    </div>
                </div>
                {stats?.jobs_by_queue && Object.entries(stats.jobs_by_queue).map(([q, count]) => (
                    <div key={q} className="col-6 col-md-3">
                        <div className="ie-stat-card">
                            <div className="ie-stat-value">{count}</div>
                            <div className="ie-stat-label">Queue: {q}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Refresh */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 text-secondary">Failed Jobs ({failed.length})</h6>
                <button className="btn btn-sm btn-outline-secondary" onClick={fetchData}>
                    <i className="bi bi-arrow-clockwise me-1" />Refresh
                </button>
            </div>

            {failed.length === 0 ? (
                <div className="text-center text-secondary py-4">
                    <i className="bi bi-check-circle" style={{ fontSize: '2rem' }} />
                    <p className="mt-2">No failed jobs.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table ie-admin-table">
                        <thead>
                            <tr><th>ID</th><th>Queue</th><th>Error</th><th>Failed At</th><th></th></tr>
                        </thead>
                        <tbody>
                            {failed.map(j => (
                                <tr key={j.id}>
                                    <td className="text-secondary" style={{ fontSize: '.8rem' }}>{j.uuid?.slice(0, 8)}…</td>
                                    <td><span className="badge bg-secondary">{j.queue}</span></td>
                                    <td style={{ maxWidth: 300 }}>
                                        <code style={{ fontSize: '.72rem', color: '#f87171', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                            {j.exception_summary}
                                        </code>
                                    </td>
                                    <td className="text-secondary" style={{ fontSize: '.8rem' }}>
                                        {new Date(j.failed_at).toLocaleString()}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button className="btn btn-sm btn-outline-success" onClick={() => retry(j.uuid)} title="Retry">
                                                <i className="bi bi-arrow-repeat" />
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => forget(j.uuid)} title="Delete">
                                                <i className="bi bi-trash" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

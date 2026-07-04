/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import Loader from '../common/Loader';

function StatCard({ icon, label, value, color = 'primary' }) {
    return (
        <div className="ie-stat-card">
            <div className={`text-${color} mb-1`} style={{ fontSize: '1.4rem' }}>
                <i className={`bi bi-${icon}`} />
            </div>
            <div className="ie-stat-value">{value ?? '—'}</div>
            <div className="ie-stat-label">{label}</div>
        </div>
    );
}

export default function StatsCards() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        adminApi.stats().then(r => setStats(r.data.data)).catch(() => {});
    }, []);

    if (!stats) return <Loader />;

    const storageGB = (stats.total_storage_used_bytes / 1024 / 1024 / 1024).toFixed(2);

    return (
        <div className="row g-3 mb-4">
            <div className="col-6 col-md-3"><StatCard icon="people" label="Total Users" value={stats.total_users} /></div>
            <div className="col-6 col-md-3"><StatCard icon="person-check" label="Active Users" value={stats.active_users} color="success" /></div>
            <div className="col-6 col-md-3"><StatCard icon="folder" label="Total Projects" value={stats.total_projects} color="info" /></div>
            <div className="col-6 col-md-3"><StatCard icon="image" label="Total Images" value={stats.total_images} color="warning" /></div>
            <div className="col-6 col-md-3"><StatCard icon="box-arrow-up" label="Exports Done" value={stats.exports_completed} color="success" /></div>
            <div className="col-6 col-md-3"><StatCard icon="stars" label="AI Jobs" value={stats.ai_jobs_total} color="primary" /></div>
            <div className="col-6 col-md-3"><StatCard icon="hdd" label="Storage Used" value={`${storageGB} GB`} color="secondary" /></div>
            <div className="col-6 col-md-3"><StatCard icon="person-plus" label="New This Week" value={stats.new_users_this_week} color="info" /></div>
        </div>
    );
}

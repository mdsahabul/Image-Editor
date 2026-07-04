/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useState } from 'react';
import Navbar       from '../components/common/Navbar';
import Footer       from '../components/common/Footer';
import StatsCards   from '../components/admin/StatsCards';
import UsersTable   from '../components/admin/UsersTable';
import QueueMonitor from '../components/admin/QueueMonitor';
import SettingsForm from '../components/admin/SettingsForm';

import '../styles/admin.css';

const SECTIONS = [
    { key: 'stats',    label: 'Dashboard',  icon: 'bi-speedometer2' },
    { key: 'users',    label: 'Users',       icon: 'bi-people' },
    { key: 'queue',    label: 'Queue',       icon: 'bi-stack' },
    { key: 'settings', label: 'Settings',   icon: 'bi-gear' },
];

export default function AdminPage() {
    const [section, setSection] = useState('stats');

    const renderSection = () => {
        switch (section) {
            case 'stats':    return <><h4 className="mb-4">Dashboard Overview</h4><StatsCards /></>;
            case 'users':    return <><h4 className="mb-4">User Management</h4><UsersTable /></>;
            case 'queue':    return <><h4 className="mb-4">Queue Monitor</h4><QueueMonitor /></>;
            case 'settings': return <><h4 className="mb-4">Application Settings</h4><SettingsForm /></>;
            default:         return null;
        }
    };

    return (
        <>
            <Navbar />
            <div className="ie-admin-layout">
                {/* Sidebar */}
                <nav className="ie-admin-sidebar">
                    <div className="px-3 mb-3">
                        <div className="small text-secondary fw-bold" style={{ letterSpacing: '.06em' }}>ADMIN PANEL</div>
                    </div>
                    {SECTIONS.map(s => (
                        <button
                            key={s.key}
                            className={`ie-admin-sidebar-link ${section === s.key ? 'active' : ''}`}
                            onClick={() => setSection(s.key)}
                        >
                            <i className={`bi ${s.icon}`} />
                            {s.label}
                        </button>
                    ))}

                    <div style={{ marginTop: 'auto', padding: '1rem 1.25rem', borderTop: '1px solid var(--ie-panel-border)' }}>
                        <div className="small text-muted">
                            © 2026 Md. Sahabul.<br />
                            All rights reserved.
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <main className="ie-admin-content">
                    {renderSection()}
                </main>
            </div>
            <Footer />
        </>
    );
}

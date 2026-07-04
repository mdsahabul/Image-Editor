/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function Navbar({ showEditorControls = false, projectName = '' }) {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully.');
        navigate('/login');
    };

    return (
        <nav className="ie-navbar">
            <Link to="/dashboard" className="ie-navbar-brand me-4">
                <i className="bi bi-layers-half me-2" />
                Image Editor
            </Link>

            {showEditorControls && projectName && (
                <span className="text-secondary" style={{ fontSize: '.85rem' }}>
                    <i className="bi bi-pencil-square me-1" />
                    {projectName}
                </span>
            )}

            <div className="ms-auto d-flex align-items-center gap-2">
                {isAdmin && (
                    <Link to="/admin" className="btn btn-sm btn-outline-warning me-1">
                        <i className="bi bi-shield-lock me-1" />Admin
                    </Link>
                )}

                <div className="dropdown">
                    <button
                        className="btn btn-sm btn-dark dropdown-toggle d-flex align-items-center gap-2"
                        data-bs-toggle="dropdown"
                    >
                        {user?.avatar_url
                            ? <img src={user.avatar_url} alt="avatar" className="rounded-circle" style={{ width: 26, height: 26, objectFit: 'cover' }} />
                            : <i className="bi bi-person-circle" style={{ fontSize: '1.2rem' }} />
                        }
                        <span className="d-none d-sm-inline" style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name}
                        </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                        <li><span className="dropdown-item-text small text-muted">{user?.email}</span></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link to="/dashboard" className="dropdown-item"><i className="bi bi-grid me-2" />Dashboard</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right me-2" />Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

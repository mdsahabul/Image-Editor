/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useCallback, useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';

export default function UsersTable() {
    const [users, setUsers]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage]     = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchUsers = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const res = await adminApi.users({ search: search || undefined, page: p, per_page: 20 });
            const { items, pagination } = res.data.data;
            setUsers(p === 1 ? items : prev => [...prev, ...items]);
            setLastPage(pagination.last_page);
            setPage(p);
        } finally { setLoading(false); }
    }, [search]);

    useEffect(() => { fetchUsers(1); }, [fetchUsers]);

    const toggleActive = async (user) => {
        try {
            await adminApi.toggleActive(user.id);
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
            toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}.`);
        } catch { toast.error('Action failed.'); }
    };

    const deleteUser = async (user) => {
        if (!window.confirm(`Delete user "${user.name}"? This is irreversible.`)) return;
        try {
            await adminApi.deleteUser(user.id);
            setUsers(prev => prev.filter(u => u.id !== user.id));
            toast.success('User deleted.');
        } catch { toast.error('Could not delete user.'); }
    };

    return (
        <div>
            <div className="d-flex gap-2 mb-3">
                <input
                    className="form-control bg-dark text-light border-secondary" style={{ maxWidth: 260 }}
                    placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)}
                />
            </div>

            {loading && users.length === 0 ? <Loader /> : (
                <div className="table-responsive">
                    <table className="table ie-admin-table">
                        <thead>
                            <tr>
                                <th>Name</th><th>Email</th><th>Role</th>
                                <th>Storage</th><th>Status</th><th>Joined</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td className="text-secondary">{u.email}</td>
                                    <td>
                                        <span className={`badge bg-${u.role === 'admin' ? 'danger' : u.role === 'editor' ? 'warning' : 'secondary'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="text-secondary" style={{ fontSize: '.8rem' }}>
                                        {(u.storage_used_bytes / 1024 / 1024).toFixed(1)} MB / {u.storage_quota_mb} MB
                                    </td>
                                    <td>
                                        <span className={`badge bg-${u.is_active ? 'success' : 'danger'}`}>
                                            {u.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-secondary" style={{ fontSize: '.8rem' }}>
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button className="btn btn-sm btn-outline-warning" onClick={() => toggleActive(u)}
                                                title={u.is_active ? 'Deactivate' : 'Activate'}>
                                                <i className={`bi bi-${u.is_active ? 'pause' : 'play'}`} />
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(u)} title="Delete">
                                                <i className="bi bi-trash" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {page < lastPage && (
                        <div className="text-center">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => fetchUsers(page + 1)} disabled={loading}>
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

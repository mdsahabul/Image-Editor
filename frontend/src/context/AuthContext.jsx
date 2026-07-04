/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(() => {
        try { return JSON.parse(localStorage.getItem('ie_user')); }
        catch { return null; }
    });
    const [loading, setLoading] = useState(true);

    // Validate stored token on mount
    useEffect(() => {
        const token = localStorage.getItem('ie_token');
        if (!token) { setLoading(false); return; }

        authApi.me()
            .then(res => setUser(res.data.data))
            .catch(() => {
                localStorage.removeItem('ie_token');
                localStorage.removeItem('ie_user');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await authApi.login({ email, password });
        const { user: u, token } = res.data.data;
        localStorage.setItem('ie_token', token);
        localStorage.setItem('ie_user', JSON.stringify(u));
        setUser(u);
        return u;
    }, []);

    const register = useCallback(async (name, email, password, password_confirmation) => {
        const res = await authApi.register({ name, email, password, password_confirmation });
        const { user: u, token } = res.data.data;
        localStorage.setItem('ie_token', token);
        localStorage.setItem('ie_user', JSON.stringify(u));
        setUser(u);
        return u;
    }, []);

    const logout = useCallback(async () => {
        try { await authApi.logout(); } catch { /* ignore */ }
        localStorage.removeItem('ie_token');
        localStorage.removeItem('ie_user');
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const res = await authApi.me();
        const u = res.data.data;
        localStorage.setItem('ie_user', JSON.stringify(u));
        setUser(u);
        return u;
    }, []);

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export default AuthContext;

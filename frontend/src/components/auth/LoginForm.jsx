/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const [form, setForm]     = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) setErrors(data.errors);
            else toast.error(data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ie-auth-wrapper">
            <div className="ie-auth-card">
                <div className="text-center mb-4">
                    <div className="ie-auth-logo mb-1"><i className="bi bi-layers-half me-2" />Image Editor</div>
                    <p className="text-secondary mb-0" style={{ fontSize: '.9rem' }}>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label text-secondary small">Email address</label>
                        <input
                            type="email" name="email" className={`form-control bg-dark text-light border-secondary ${errors.email ? 'is-invalid' : ''}`}
                            value={form.email} onChange={handleChange} autoComplete="email" required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-secondary small">Password</label>
                        <input
                            type="password" name="password" className={`form-control bg-dark text-light border-secondary ${errors.password ? 'is-invalid' : ''}`}
                            value={form.password} onChange={handleChange} autoComplete="current-password" required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <button type="submit" className="btn btn-ie-primary w-100 py-2" disabled={loading}>
                        {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in…</> : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <Link to="/forgot-password" className="small text-secondary">Forgot password?</Link>
                </div>
                <hr className="border-secondary" />
                <div className="text-center small text-secondary">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>

                <div className="text-center mt-4 small text-muted">
                    © 2026 Md. Sahabul. All rights reserved.<br />
                    Designed &amp; developed by Md. Sahabul.
                </div>
            </div>
        </div>
    );
}

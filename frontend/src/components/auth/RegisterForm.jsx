/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function RegisterForm() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.password_confirmation);
            toast.success('Account created! Welcome to Image Editor.');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) setErrors(data.errors);
            else toast.error(data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const field = (name, label, type = 'text', autoComplete = '') => (
        <div className="mb-3">
            <label className="form-label text-secondary small">{label}</label>
            <input
                type={type} name={name} autoComplete={autoComplete}
                className={`form-control bg-dark text-light border-secondary ${errors[name] ? 'is-invalid' : ''}`}
                value={form[name]} onChange={handleChange} required
            />
            {errors[name] && <div className="invalid-feedback">{Array.isArray(errors[name]) ? errors[name][0] : errors[name]}</div>}
        </div>
    );

    return (
        <div className="ie-auth-wrapper">
            <div className="ie-auth-card">
                <div className="text-center mb-4">
                    <div className="ie-auth-logo mb-1"><i className="bi bi-layers-half me-2" />Image Editor</div>
                    <p className="text-secondary mb-0" style={{ fontSize: '.9rem' }}>Create a free account</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {field('name', 'Full Name', 'text', 'name')}
                    {field('email', 'Email address', 'email', 'email')}
                    {field('password', 'Password', 'password', 'new-password')}
                    {field('password_confirmation', 'Confirm Password', 'password', 'new-password')}

                    <button type="submit" className="btn btn-ie-primary w-100 py-2" disabled={loading}>
                        {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating account…</> : 'Create Account'}
                    </button>
                </form>

                <hr className="border-secondary mt-3" />
                <div className="text-center small text-secondary">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>

                <div className="text-center mt-4 small text-muted">
                    © 2026 Md. Sahabul. All rights reserved.<br />
                    Designed &amp; developed by Md. Sahabul.
                </div>
            </div>
        </div>
    );
}

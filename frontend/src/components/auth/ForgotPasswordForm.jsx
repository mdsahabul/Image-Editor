/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../../api/authApi';
import { toast } from 'react-toastify';

export default function ForgotPasswordForm() {
    const [email, setEmail]     = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent]       = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSent(true);
            toast.success('Reset link sent if the email exists.');
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ie-auth-wrapper">
            <div className="ie-auth-card">
                <div className="text-center mb-4">
                    <div className="ie-auth-logo mb-1"><i className="bi bi-layers-half me-2" />Image Editor</div>
                    <p className="text-secondary mb-0" style={{ fontSize: '.9rem' }}>Reset your password</p>
                </div>

                {sent ? (
                    <div className="alert alert-success text-center small">
                        If an account exists for <strong>{email}</strong>, you will receive a reset link shortly.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label text-secondary small">Email address</label>
                            <input
                                type="email" className="form-control bg-dark text-light border-secondary"
                                value={email} onChange={e => setEmail(e.target.value)} required
                            />
                        </div>
                        <button type="submit" className="btn btn-ie-primary w-100 py-2" disabled={loading}>
                            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Sending…</> : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div className="text-center mt-3 small">
                    <Link to="/login" className="text-secondary"><i className="bi bi-arrow-left me-1" />Back to login</Link>
                </div>
                <div className="text-center mt-4 small text-muted">
                    © 2026 Md. Sahabul. All rights reserved.<br />Designed &amp; developed by Md. Sahabul.
                </div>
            </div>
        </div>
    );
}

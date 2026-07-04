/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ie-darker)' }}>
            <div className="text-center">
                <div style={{ fontSize: '5rem', color: 'var(--ie-primary)', lineHeight: 1 }}>404</div>
                <h2 className="mt-3 text-light">Page Not Found</h2>
                <p className="text-secondary">The page you're looking for doesn't exist.</p>
                <Link to="/dashboard" className="btn btn-ie-primary mt-2">
                    <i className="bi bi-house me-2" />Go to Dashboard
                </Link>
                <div className="mt-5 small text-muted">
                    © 2026 Md. Sahabul. All rights reserved.
                </div>
            </div>
        </div>
    );
}

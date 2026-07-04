/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React from 'react';

export default function Loader({ overlay = false, text = 'Loading…' }) {
    const inner = (
        <div className="d-flex flex-column align-items-center gap-2">
            <div className="spinner-border text-primary" role="status" style={{ width: 40, height: 40 }}>
                <span className="visually-hidden">Loading…</span>
            </div>
            {text && <small className="text-secondary">{text}</small>}
        </div>
    );

    if (overlay) {
        return <div className="ie-loader-overlay">{inner}</div>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center p-5">
            {inner}
        </div>
    );
}

/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';

export default function SettingsForm() {
    const [settings, setSettings] = useState(null);
    const [saving,   setSaving]   = useState(false);

    useEffect(() => {
        adminApi.getSettings()
            .then(r => setSettings(r.data.data))
            .catch(() => toast.error('Could not load settings.'));
    }, []);

    const handleChange = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminApi.updateSettings(settings);
            toast.success('Settings saved.');
        } catch { toast.error('Save failed.'); }
        finally { setSaving(false); }
    };

    if (!settings) return <Loader />;

    return (
        <div style={{ maxWidth: 540 }}>
            <div className="mb-4">
                <label className="form-label text-secondary small">Default User Storage Quota (MB)</label>
                <input
                    type="number" min={1}
                    className="form-control bg-dark text-light border-secondary"
                    value={settings.default_user_quota_mb}
                    onChange={e => handleChange('default_user_quota_mb', +e.target.value)}
                />
                <div className="form-text text-muted">Applied to newly registered users.</div>
            </div>

            <div className="mb-4">
                <label className="form-label text-secondary small">Max Upload Size (MB)</label>
                <input
                    type="number" min={1} max={500}
                    className="form-control bg-dark text-light border-secondary"
                    value={settings.max_upload_size_mb}
                    onChange={e => handleChange('max_upload_size_mb', +e.target.value)}
                />
            </div>

            <div className="mb-4">
                <div className="form-check form-switch">
                    <input
                        className="form-check-input" type="checkbox" role="switch"
                        id="reg-enabled"
                        checked={!!settings.registration_enabled}
                        onChange={e => handleChange('registration_enabled', e.target.checked)}
                    />
                    <label className="form-check-label text-secondary" htmlFor="reg-enabled">
                        Allow new user registrations
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <div className="form-check form-switch">
                    <input
                        className="form-check-input" type="checkbox" role="switch"
                        id="maintenance"
                        checked={!!settings.maintenance_mode}
                        onChange={e => handleChange('maintenance_mode', e.target.checked)}
                    />
                    <label className="form-check-label text-secondary" htmlFor="maintenance">
                        Maintenance Mode <span className="badge bg-danger ms-1">disables frontend access</span>
                    </label>
                </div>
            </div>

            <button className="btn btn-ie-primary" onClick={handleSave} disabled={saving}>
                {saving
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                    : <><i className="bi bi-check-lg me-2" />Save Settings</>
                }
            </button>
        </div>
    );
}

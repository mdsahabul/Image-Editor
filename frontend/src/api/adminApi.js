/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import axiosClient from './axiosClient';

const adminApi = {
    stats:        ()              => axiosClient.get('/admin/stats'),
    users:        (params)        => axiosClient.get('/admin/users', { params }),
    getUser:      (id)            => axiosClient.get(`/admin/users/${id}`),
    updateUser:   (id, payload)   => axiosClient.put(`/admin/users/${id}`, payload),
    deleteUser:   (id)            => axiosClient.delete(`/admin/users/${id}`),
    toggleActive: (id)            => axiosClient.post(`/admin/users/${id}/toggle-active`),
    getSettings:  ()              => axiosClient.get('/admin/settings'),
    updateSettings:(payload)      => axiosClient.put('/admin/settings', payload),
    queueStats:   ()              => axiosClient.get('/admin/queue/stats'),
    failedJobs:   ()              => axiosClient.get('/admin/queue/failed'),
    retryJob:     (id)            => axiosClient.post(`/admin/queue/failed/${id}/retry`),
    forgetJob:    (id)            => axiosClient.delete(`/admin/queue/failed/${id}`),
};

export default adminApi;

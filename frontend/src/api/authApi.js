/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import axiosClient from './axiosClient';

const authApi = {
    register: (payload) => axiosClient.post('/auth/register', payload),
    login: (payload) => axiosClient.post('/auth/login', payload),
    logout: () => axiosClient.post('/auth/logout'),
    logoutAll: () => axiosClient.post('/auth/logout-all'),
    forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
    resetPassword: (payload) => axiosClient.post('/auth/reset-password', payload),
    me: () => axiosClient.get('/me'),
    updateProfile: (formData) =>
        axiosClient.put('/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    updatePassword: (payload) => axiosClient.put('/password', payload),
};

export default authApi;

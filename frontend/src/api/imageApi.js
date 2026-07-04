/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import axiosClient from './axiosClient';

const imageApi = {
    list: (params) => axiosClient.get('/images', { params }),
    get: (id) => axiosClient.get(`/images/${id}`),
    upload: (file, projectId, onUploadProgress) => {
        const formData = new FormData();
        formData.append('file', file);
        if (projectId) formData.append('project_id', projectId);

        return axiosClient.post('/images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        });
    },
    remove: (id) => axiosClient.delete(`/images/${id}`),
};

export default imageApi;

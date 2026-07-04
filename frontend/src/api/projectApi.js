/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import axiosClient from './axiosClient';

const projectApi = {
    list: (params) => axiosClient.get('/projects', { params }),
    get: (id) => axiosClient.get(`/projects/${id}`),
    create: (payload) => axiosClient.post('/projects', payload),
    update: (id, payload) => axiosClient.put(`/projects/${id}`, payload),
    remove: (id) => axiosClient.delete(`/projects/${id}`),
    duplicate: (id) => axiosClient.post(`/projects/${id}/duplicate`),

    listFolders: () => axiosClient.get('/folders'),
    createFolder: (payload) => axiosClient.post('/folders', payload),
    updateFolder: (id, payload) => axiosClient.put(`/folders/${id}`, payload),
    removeFolder: (id) => axiosClient.delete(`/folders/${id}`),
};

export default projectApi;

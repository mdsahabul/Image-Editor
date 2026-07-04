/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import axiosClient from './axiosClient';

const exportApi = {
    list:   (projectId)          => axiosClient.get(`/projects/${projectId}/exports`),
    create: (projectId, payload) => axiosClient.post(`/projects/${projectId}/exports`, payload),
    get:    (projectId, exportId)=> axiosClient.get(`/projects/${projectId}/exports/${exportId}`),
};

export default exportApi;

/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import axiosClient from './axiosClient';

const layerApi = {
    list:          (projectId)              => axiosClient.get(`/projects/${projectId}/layers`),
    create:        (projectId, payload)     => axiosClient.post(`/projects/${projectId}/layers`, payload),
    update:        (projectId, layerId, payload) => axiosClient.put(`/projects/${projectId}/layers/${layerId}`, payload),
    remove:        (projectId, layerId)     => axiosClient.delete(`/projects/${projectId}/layers/${layerId}`),
    reorder:       (projectId, layerIds)    => axiosClient.post(`/projects/${projectId}/layers/reorder`, { layer_ids: layerIds }),
    saveVersion:   (projectId, label)       => axiosClient.post(`/projects/${projectId}/versions`, { label }),
    restoreVersion:(projectId, versionId)   => axiosClient.post(`/projects/${projectId}/versions/${versionId}/restore`),
};

export default layerApi;

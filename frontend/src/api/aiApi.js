/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import axiosClient from './axiosClient';

const aiApi = {
    removeBackground: (imageId)         => axiosClient.post(`/images/${imageId}/ai/remove-background`),
    upscale:          (imageId, scale)  => axiosClient.post(`/images/${imageId}/ai/upscale`, { scale }),
    autoEnhance:      (imageId)         => axiosClient.post(`/images/${imageId}/ai/auto-enhance`),
    jobStatus:        (jobId)           => axiosClient.get(`/ai-jobs/${jobId}`),
};

export default aiApi;

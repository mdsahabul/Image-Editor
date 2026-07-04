/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React from 'react';
import { useEditor } from '../../context/EditorContext';
import layerApi from '../../api/layerApi';
import { toast } from 'react-toastify';

const TYPE_ICONS = { image: 'bi-image', text: 'bi-type', shape: 'bi-pentagon', group: 'bi-collection' };

export default function LayerPanel({ projectId }) {
    const { layers, setLayers, selectedLayerId, setSelectedLayerId } = useEditor();

    const toggleVisibility = async (layer) => {
        const updated = { ...layer, is_visible: !layer.is_visible };
        setLayers(prev => prev.map(l => l.id === layer.id ? updated : l));
        try {
            await layerApi.update(projectId, layer.id, { is_visible: !layer.is_visible });
        } catch { toast.error('Could not update layer.'); }
    };

    const toggleLock = async (layer) => {
        const updated = { ...layer, is_locked: !layer.is_locked };
        setLayers(prev => prev.map(l => l.id === layer.id ? updated : l));
        try {
            await layerApi.update(projectId, layer.id, { is_locked: !layer.is_locked });
        } catch { toast.error('Could not update layer.'); }
    };

    const deleteLayer = async (layer) => {
        if (!window.confirm(`Delete layer "${layer.name}"?`)) return;
        setLayers(prev => prev.filter(l => l.id !== layer.id));
        try {
            await layerApi.remove(projectId, layer.id);
        } catch { toast.error('Could not delete layer.'); }
    };

    const sorted = [...layers].sort((a, b) => b.z_index - a.z_index);

    return (
        <div className="ie-layer-panel">
            <div className="d-flex align-items-center justify-content-between px-3 py-1 border-bottom" style={{ borderColor: 'var(--ie-panel-border)', background: 'var(--ie-dark)' }}>
                <span style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#6b7280' }}>Layers</span>
                <span className="badge bg-secondary" style={{ fontSize: '.65rem' }}>{layers.length}</span>
            </div>
            {sorted.length === 0 && (
                <div className="text-center text-secondary py-3" style={{ fontSize: '.8rem' }}>No layers yet. Add an image or shape.</div>
            )}
            {sorted.map(layer => (
                <div
                    key={layer.id}
                    className={`ie-layer-item ${selectedLayerId === layer.id ? 'active' : ''}`}
                    onClick={() => setSelectedLayerId(layer.id)}
                >
                    {layer.image?.thumbnail_url
                        ? <img src={layer.image.thumbnail_url} alt="" className="ie-layer-thumb" />
                        : <div className="ie-layer-thumb d-flex align-items-center justify-content-center text-secondary">
                            <i className={`bi ${TYPE_ICONS[layer.type] || 'bi-layers'}`} />
                          </div>
                    }
                    <span className="ie-layer-name">{layer.name}</span>
                    <div className="d-flex gap-1 ms-1 flex-shrink-0">
                        <button
                            className={`ie-tool-btn p-0 ${!layer.is_visible ? 'text-secondary' : ''}`}
                            style={{ width: 22, height: 22, fontSize: '.8rem' }}
                            onClick={e => { e.stopPropagation(); toggleVisibility(layer); }}
                            title={layer.is_visible ? 'Hide' : 'Show'}
                        >
                            <i className={`bi bi-eye${layer.is_visible ? '' : '-slash'}`} />
                        </button>
                        <button
                            className={`ie-tool-btn p-0 ${layer.is_locked ? 'text-warning' : 'text-secondary'}`}
                            style={{ width: 22, height: 22, fontSize: '.8rem' }}
                            onClick={e => { e.stopPropagation(); toggleLock(layer); }}
                            title={layer.is_locked ? 'Unlock' : 'Lock'}
                        >
                            <i className={`bi bi-lock${layer.is_locked ? '-fill' : ''}`} />
                        </button>
                        <button
                            className="ie-tool-btn p-0 text-danger"
                            style={{ width: 22, height: 22, fontSize: '.8rem' }}
                            onClick={e => { e.stopPropagation(); deleteLayer(layer); }}
                            title="Delete layer"
                        >
                            <i className="bi bi-trash" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

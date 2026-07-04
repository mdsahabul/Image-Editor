/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorProvider, useEditor } from '../context/EditorContext';
import Navbar      from '../components/common/Navbar';
import ToolbarTop  from '../components/editor/ToolbarTop';
import ToolbarLeft from '../components/editor/ToolbarLeft';
import CanvasStage from '../components/editor/CanvasStage';
import PropertiesPanel from '../components/editor/PropertiesPanel';
import FilterPanel from '../components/editor/FilterPanel';
import AiPanel     from '../components/editor/AiPanel';
import LayerPanel  from '../components/editor/LayerPanel';
import CropTool    from '../components/editor/CropTool';
import Loader      from '../components/common/Loader';
import projectApi  from '../api/projectApi';
import { toast }   from 'react-toastify';

import '../styles/editor.css';

function EditorShell({ projectId }) {
    const { setProject, setLayers, showCropTool, showFilterPanel, showAiPanel } = useEditor();
    const [loading, setLoading] = useState(true);
    const [project, setLocalProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        projectApi.get(projectId)
            .then(res => {
                const p = res.data.data;
                setLocalProject(p);
                setProject(p);
                setLayers(p.layers || []);
            })
            .catch(() => {
                toast.error('Project not found or access denied.');
                navigate('/dashboard');
            })
            .finally(() => setLoading(false));
    }, [projectId, setProject, setLayers, navigate]);

    // Keyboard shortcut: Delete key removes selected object
    useEffect(() => {
        const handler = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                // Handled by useCanvas hook via deleteSelected
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    if (loading) return <Loader overlay text="Loading project…" />;
    if (!project)  return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <Navbar showEditorControls projectName={project.title} />
            <ToolbarTop project={project} />

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left tools */}
                <ToolbarLeft />

                {/* Canvas */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <CanvasStage project={project} />
                    <LayerPanel projectId={projectId} />
                </div>

                {/* Right panel — Properties / Filter / AI */}
                {showFilterPanel ? <FilterPanel /> : showAiPanel ? <AiPanel /> : <PropertiesPanel />}
            </div>

            {showCropTool && <CropTool />}
        </div>
    );
}

export default function EditorPage() {
    const { id } = useParams();
    return (
        <EditorProvider>
            <EditorShell projectId={id} />
        </EditorProvider>
    );
}

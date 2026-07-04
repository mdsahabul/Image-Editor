/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React from 'react';
import { useEditor, TOOLS } from '../../context/EditorContext';
import { useCanvas } from '../../hooks/useCanvas';

export default function ToolbarLeft() {
    const { activeTool, setActiveTool, setShowCropTool, setShowFilterPanel, setShowAiPanel } = useEditor();
    const { addText, addShape, deleteSelected } = useCanvas('fabric-canvas');

    const tool = (icon, toolName, title, onClick) => {
        const isActive = activeTool === toolName;
        const handleClick = () => {
            setActiveTool(toolName);
            if (onClick) onClick();
        };
        return (
            <button key={toolName} className={`ie-tool-btn ${isActive ? 'active' : ''}`} onClick={handleClick} title={title}>
                <i className={`bi bi-${icon}`} />
            </button>
        );
    };

    return (
        <div className="ie-toolbar-left">
            {tool('cursor', TOOLS.SELECT, 'Select / Move (V)')}
            {tool('arrows-move', TOOLS.MOVE, 'Pan canvas (H)')}

            <div className="border-top border-secondary w-100 my-1" />

            {tool('crop', TOOLS.CROP, 'Crop (C)', () => setShowCropTool(true))}
            {tool('type', TOOLS.TEXT, 'Add Text (T)', () => addText())}
            {tool('brush', TOOLS.BRUSH, 'Brush (B)')}
            {tool('eraser', TOOLS.ERASER, 'Eraser (E)')}

            <div className="border-top border-secondary w-100 my-1" />

            <button className="ie-tool-btn" title="Rectangle" onClick={() => addShape('rect')}>
                <i className="bi bi-square" />
            </button>
            <button className="ie-tool-btn" title="Circle" onClick={() => addShape('circle')}>
                <i className="bi bi-circle" />
            </button>
            <button className="ie-tool-btn" title="Triangle" onClick={() => addShape('triangle')}>
                <i className="bi bi-triangle" />
            </button>

            <div className="border-top border-secondary w-100 my-1" />

            <button className="ie-tool-btn" title="Filters" onClick={() => setShowFilterPanel(p => !p)}>
                <i className="bi bi-sliders" />
            </button>
            <button className="ie-tool-btn" title="AI Tools" onClick={() => setShowAiPanel(p => !p)}>
                <i className="bi bi-stars" />
            </button>

            <div className="mt-auto border-top border-secondary w-100 my-1" />

            <button className="ie-tool-btn text-danger" title="Delete Selected (Del)" onClick={deleteSelected}>
                <i className="bi bi-trash" />
            </button>
        </div>
    );
}

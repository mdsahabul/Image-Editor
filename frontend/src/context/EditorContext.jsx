/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const EditorContext = createContext(null);

export const TOOLS = {
    SELECT:  'select',
    MOVE:    'move',
    CROP:    'crop',
    TEXT:    'text',
    SHAPE:   'shape',
    BRUSH:   'brush',
    ERASER:  'eraser',
};

export function EditorProvider({ children }) {
    const fabricRef       = useRef(null);  // Fabric.js canvas instance
    const [activeTool, setActiveTool]       = useState(TOOLS.SELECT);
    const [selectedLayerId, setSelectedLayerId] = useState(null);
    const [layers, setLayers]               = useState([]);
    const [project, setProject]             = useState(null);
    const [isDirty, setIsDirty]             = useState(false);
    const [zoom, setZoom]                   = useState(1);
    const [panOffset, setPanOffset]         = useState({ x: 0, y: 0 });
    const [showCropTool, setShowCropTool]   = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [showAiPanel, setShowAiPanel]     = useState(false);

    // Undo / redo stacks (stored as JSON snapshots of fabric canvas)
    const undoStack = useRef([]);
    const redoStack = useRef([]);

    const pushUndo = useCallback((snapshot) => {
        undoStack.current.push(snapshot);
        if (undoStack.current.length > 50) undoStack.current.shift();
        redoStack.current = [];
    }, []);

    const undo = useCallback(() => {
        if (undoStack.current.length === 0) return;
        const canvas = fabricRef.current;
        if (!canvas) return;
        const current = JSON.stringify(canvas.toJSON());
        redoStack.current.push(current);
        const prev = undoStack.current.pop();
        canvas.loadFromJSON(prev, () => canvas.renderAll());
    }, []);

    const redo = useCallback(() => {
        if (redoStack.current.length === 0) return;
        const canvas = fabricRef.current;
        if (!canvas) return;
        const current = JSON.stringify(canvas.toJSON());
        undoStack.current.push(current);
        const next = redoStack.current.pop();
        canvas.loadFromJSON(next, () => canvas.renderAll());
    }, []);

    const markDirty = useCallback(() => setIsDirty(true), []);
    const markClean = useCallback(() => setIsDirty(false), []);

    return (
        <EditorContext.Provider value={{
            fabricRef,
            activeTool, setActiveTool,
            selectedLayerId, setSelectedLayerId,
            layers, setLayers,
            project, setProject,
            isDirty, markDirty, markClean,
            zoom, setZoom,
            panOffset, setPanOffset,
            showCropTool, setShowCropTool,
            showFilterPanel, setShowFilterPanel,
            showAiPanel, setShowAiPanel,
            pushUndo, undo, redo,
            canUndo: () => undoStack.current.length > 0,
            canRedo: () => redoStack.current.length > 0,
        }}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error('useEditor must be used within EditorProvider');
    return ctx;
}

export default EditorContext;

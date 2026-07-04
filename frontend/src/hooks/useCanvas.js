/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import { useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useEditor, TOOLS } from '../context/EditorContext';

export function useCanvas(canvasElementId) {
    const { fabricRef, activeTool, project, pushUndo, markDirty } = useEditor();

    useEffect(() => {
        if (!project) return;

        const canvas = new fabric.Canvas(canvasElementId, {
            width:           project.canvas_width,
            height:          project.canvas_height,
            backgroundColor: project.background_color || '#ffffff',
            preserveObjectStacking: true,
            selection:       true,
        });

        fabricRef.current = canvas;

        canvas.on('object:modified', () => {
            pushUndo(JSON.stringify(canvas.toJSON()));
            markDirty();
        });

        canvas.on('object:added', () => markDirty());

        return () => {
            canvas.dispose();
            fabricRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasElementId, project]);

    // Sync drawing mode with active tool
    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        canvas.isDrawingMode = activeTool === TOOLS.BRUSH || activeTool === TOOLS.ERASER;

        if (activeTool === TOOLS.BRUSH) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.width = 8;
            canvas.freeDrawingBrush.color = '#000000';
        }

        if (activeTool === TOOLS.ERASER) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.width = 20;
            canvas.freeDrawingBrush.color = '#ffffff';
        }
    }, [activeTool, fabricRef]);

    const addImageFromUrl = useCallback((url, options = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        fabric.Image.fromURL(url, (img) => {
            img.set({
                left:  options.left  || 50,
                top:   options.top   || 50,
                scaleX: options.scaleX || 1,
                scaleY: options.scaleY || 1,
                ...options,
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            pushUndo(JSON.stringify(canvas.toJSON()));
        }, { crossOrigin: 'anonymous' });
    }, [fabricRef, pushUndo]);

    const addText = useCallback((text = 'Text', options = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const textObj = new fabric.IText(text, {
            left:     100,
            top:      100,
            fontFamily: 'Arial',
            fontSize: 32,
            fill:     '#000000',
            ...options,
        });

        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        canvas.renderAll();
        pushUndo(JSON.stringify(canvas.toJSON()));
    }, [fabricRef, pushUndo]);

    const addShape = useCallback((shapeType, options = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        let shape;
        const defaults = { left: 100, top: 100, fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 2 };

        switch (shapeType) {
            case 'rect':
                shape = new fabric.Rect({ ...defaults, width: 200, height: 150, ...options });
                break;
            case 'circle':
                shape = new fabric.Circle({ ...defaults, radius: 80, ...options });
                break;
            case 'triangle':
                shape = new fabric.Triangle({ ...defaults, width: 200, height: 180, ...options });
                break;
            default:
                return;
        }

        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();
        pushUndo(JSON.stringify(canvas.toJSON()));
    }, [fabricRef, pushUndo]);

    const deleteSelected = useCallback(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const active = canvas.getActiveObjects();
        active.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
        pushUndo(JSON.stringify(canvas.toJSON()));
        markDirty();
    }, [fabricRef, pushUndo, markDirty]);

    const exportAsDataURL = useCallback((format = 'png', quality = 0.92) => {
        const canvas = fabricRef.current;
        if (!canvas) return null;
        return canvas.toDataURL({ format, quality, multiplier: 1 });
    }, [fabricRef]);

    const loadJSON = useCallback((json) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        canvas.loadFromJSON(json, () => canvas.renderAll());
    }, [fabricRef]);

    const getJSON = useCallback(() => {
        const canvas = fabricRef.current;
        if (!canvas) return null;
        return canvas.toJSON();
    }, [fabricRef]);

    return { addImageFromUrl, addText, addShape, deleteSelected, exportAsDataURL, loadJSON, getJSON };
}

export default useCanvas;

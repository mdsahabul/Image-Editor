/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React, { useEffect, useState } from 'react';
import { useEditor } from '../../context/EditorContext';

function Num({ label, val, onChange, min, max, step = 1 }) {
    return (
        <div className="mb-2">
            <div className="ie-input-label">{label}</div>
            <input type="number" className="ie-input" value={val} min={min} max={max} step={step}
                onChange={e => onChange(Number(e.target.value))} />
        </div>
    );
}

export default function PropertiesPanel() {
    const { fabricRef, selectedLayerId, layers, showFilterPanel, showAiPanel } = useEditor();
    const [props, setProps] = useState(null);

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (!obj) { setProps(null); return; }

        const sync = () => setProps({
            x:       Math.round(obj.left),
            y:       Math.round(obj.top),
            w:       Math.round(obj.getScaledWidth()),
            h:       Math.round(obj.getScaledHeight()),
            rotation: Math.round(obj.angle),
            opacity: Math.round((obj.opacity ?? 1) * 100),
            fill:    obj.fill || '#000000',
            type:    obj.type,
        });

        sync();
        canvas.on('object:modified', sync);
        canvas.on('selection:updated', sync);
        return () => { canvas.off('object:modified', sync); canvas.off('selection:updated', sync); };
    }, [fabricRef, selectedLayerId]);

    const apply = (changes) => {
        const canvas = fabricRef.current;
        const obj = canvas?.getActiveObject();
        if (!obj) return;
        if ('x' in changes) obj.set({ left: changes.x });
        if ('y' in changes) obj.set({ top: changes.y });
        if ('rotation' in changes) obj.set({ angle: changes.rotation });
        if ('opacity' in changes) obj.set({ opacity: changes.opacity / 100 });
        if ('fill' in changes) obj.set({ fill: changes.fill });
        obj.setCoords();
        canvas.renderAll();
        setProps(p => ({ ...p, ...changes }));
    };

    if (showAiPanel || showFilterPanel) return null;
    if (!props) {
        return (
            <div className="ie-properties">
                <div className="ie-properties-section text-secondary text-center" style={{ fontSize: '.82rem' }}>
                    <i className="bi bi-cursor me-1" /> Select an object to edit its properties.
                </div>
            </div>
        );
    }

    return (
        <div className="ie-properties">
            <div className="ie-properties-section">
                <div className="ie-properties-section-title">Position</div>
                <div className="row g-1">
                    <div className="col-6"><Num label="X" val={props.x} onChange={v => apply({ x: v })} /></div>
                    <div className="col-6"><Num label="Y" val={props.y} onChange={v => apply({ y: v })} /></div>
                </div>
            </div>

            <div className="ie-properties-section">
                <div className="ie-properties-section-title">Size</div>
                <div className="row g-1">
                    <div className="col-6"><Num label="W" val={props.w} min={1} onChange={() => {}} /></div>
                    <div className="col-6"><Num label="H" val={props.h} min={1} onChange={() => {}} /></div>
                </div>
            </div>

            <div className="ie-properties-section">
                <div className="ie-properties-section-title">Transform</div>
                <Num label="Rotation (°)" val={props.rotation} min={-360} max={360} onChange={v => apply({ rotation: v })} />
                <div className="mb-2">
                    <div className="ie-input-label">Opacity ({props.opacity}%)</div>
                    <input type="range" className="ie-slider" min={0} max={100} value={props.opacity}
                        onChange={e => apply({ opacity: Number(e.target.value) })} />
                </div>
            </div>

            {(props.type === 'rect' || props.type === 'circle' || props.type === 'triangle' || props.type === 'i-text') && (
                <div className="ie-properties-section">
                    <div className="ie-properties-section-title">Fill Color</div>
                    <div className="d-flex gap-2 align-items-center">
                        <input type="color" className="form-control form-control-color border-secondary"
                            value={props.fill?.startsWith('#') ? props.fill : '#000000'}
                            onChange={e => apply({ fill: e.target.value })}
                            style={{ width: 42, padding: 2, background: 'transparent' }} />
                        <span className="ie-input-label">{props.fill}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

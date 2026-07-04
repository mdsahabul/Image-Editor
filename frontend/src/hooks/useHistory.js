/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import { useEffect } from 'react';
import { useEditor } from '../context/EditorContext';

export function useHistory() {
    const { undo, redo, canUndo, canRedo } = useEditor();

    useEffect(() => {
        const handler = (e) => {
            const isMac   = navigator.platform.toUpperCase().includes('MAC');
            const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

            if (!ctrlKey) return;

            if (e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo]);

    return { undo, redo, canUndo, canRedo };
}

export default useHistory;

"use client";

/**
 * LiveCodeEditor v2.0 - Enhanced Interactive Python Code Editor
 *
 * Features:
 * - Lazy-loaded Pyodide (only loads on first run)
 * - Optimized syntax highlighting with debouncing
 * - Auto-save to localStorage
 * - Undo/Redo support
 * - Full keyboard shortcuts
 * - Error boundaries
 * - Type-safe throughout
 * - Mobile-friendly
 * - Accessible (ARIA compliant)
 * - Performance optimized
 *
 * @example
 * ```tsx
 * <LiveCodeEditor
 *   initialCode="print('Hello World')"
 *   onSuccess={(output) => console.log(output)}
 *   autoSave={true}
 *   storageKey="my-editor"
 * />
 * ```
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import { motion, AnimatePresence } from "framer-motion";
import {
    Play, RotateCcw, Terminal, Loader2,
    CheckCircle2, AlertCircle, Code2,
    Copy, Check, Clock, Download, Undo2, Redo2,
    Keyboard, Info
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface PyodideInterface {
    loadPackage: (packages: string | string[]) => Promise<void>;
    runPython: (code: string) => string;
    runPythonAsync: (code: string) => Promise<unknown>;
}

declare global {
    interface Window {
        loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
    }
}

export interface LiveCodeEditorProps {
    /** Initial Python code to display */
    initialCode: string;

    /** Optional callback to simulate execution without running Pyodide */
    onRun?: (code: string) => string;

    /** Callback fired when code runs successfully */
    onSuccess?: (output: string) => void;

    /** Callback fired when code execution fails */
    onError?: (error: string) => void;

    /** Callback fired when code changes */
    onChange?: (code: string) => void;

    /** Enable auto-save to localStorage */
    autoSave?: boolean;

    /** LocalStorage key for auto-save (required if autoSave=true) */
    storageKey?: string;

    /** Maximum execution time in milliseconds */
    maxExecutionTime?: number;

    /** Show keyboard shortcuts hint */
    showKeyboardHints?: boolean;

    /** Custom height */
    height?: string;

    /** Additional packages to load with Pyodide */
    pythonPackages?: string[];

    /** Read-only mode */
    readOnly?: boolean;

    /** Custom theme colors */
    theme?: {
        primary?: string;
        background?: string;
        border?: string;
    };

    /** Hidden setup code to run before the user's code (useful for mocking libraries) */
    setupCode?: string;
}

interface ExecutionResult {
    output: string;
    error: string | null;
    executionTime: number;
    timestamp: Date;
}

interface EditorState {
    code: string;
    history: string[];
    historyIndex: number;
}

// ============================================================================
// PYODIDE MANAGER (Singleton with lazy loading)
// ============================================================================

class PyodideManager {
    private static instance: PyodideManager;
    private pyodide: PyodideInterface | null = null;
    private loadingPromise: Promise<PyodideInterface> | null = null;
    private isLoaded = false;
    private loadStartTime: number | null = null;

    private constructor() {}

    static getInstance(): PyodideManager {
        if (!PyodideManager.instance) {
            PyodideManager.instance = new PyodideManager();
        }
        return PyodideManager.instance;
    }

    /**
     * Load Pyodide script dynamically
     */
    private async loadScript(src: string): Promise<void> {
        if (typeof document !== 'undefined' && document.querySelector(`script[src="${src}"]`)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load Pyodide script: ${src}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize Pyodide (lazy loaded on first use)
     */
    async initialize(packages: string[] = ['numpy']): Promise<PyodideInterface> {
        // Return cached instance if already loaded
        if (this.isLoaded && this.pyodide) {
            return this.pyodide;
        }

        // Return in-progress loading promise
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        // Start loading
        this.loadStartTime = performance.now();
        this.loadingPromise = (async () => {
            try {
                // Load Pyodide script
                if (typeof window !== 'undefined' && !window.loadPyodide) {
                    await this.loadScript("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
                }

                // Initialize Pyodide
                this.pyodide = await window.loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
                });

                // Load packages
                if (packages.length > 0) {
                    await this.pyodide.loadPackage(packages);
                }

                this.isLoaded = true;
                const loadTime = performance.now() - (this.loadStartTime || 0);
                console.log(`✅ Pyodide loaded in ${(loadTime / 1000).toFixed(2)}s`);

                return this.pyodide;
            } catch (error) {
                this.loadingPromise = null;
                throw new Error(`Failed to initialize Pyodide: ${error}`);
            }
        })();

        return this.loadingPromise;
    }

    /**
     * Execute Python code with timeout
     */
    async execute(code: string, timeoutMs: number = 30000): Promise<ExecutionResult> {
        if (!this.pyodide) {
            throw new Error('Pyodide not initialized. Call initialize() first.');
        }

        const startTime = performance.now();

        try {
            // Setup stdout capture
            this.pyodide.runPython(`
                import sys
                import io
                sys.stdout = io.StringIO()
            `);

            // Execute with timeout
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Execution timeout')), timeoutMs);
            });

            await Promise.race([
                this.pyodide.runPythonAsync(code),
                timeoutPromise
            ]);

            // Get output
            const stdout = this.pyodide.runPython("sys.stdout.getvalue()");
            const executionTime = (performance.now() - startTime) / 1000;

            return {
                output: stdout,
                error: null,
                executionTime,
                timestamp: new Date()
            };

        } catch (err: unknown) {
            const executionTime = (performance.now() - startTime) / 1000;
            const errorMsg = this.parseError(err);

            return {
                output: '',
                error: errorMsg,
                executionTime,
                timestamp: new Date()
            };
        }
    }

    /**
     * Parse Python error messages to be user-friendly
     */
    private parseError(err: unknown): string {
        const errorString = String(err);

        // Extract meaningful error message
        if (errorString.includes('PythonError:')) {
            const parts = errorString.split('PythonError:');
            return parts[parts.length - 1].trim();
        }

        if (errorString.includes('timeout')) {
            return 'קוד לקח יותר מדי זמן להרצה (timeout). בדוק אם יש לולאות אינסופיות.';
        }

        return errorString;
    }

    /**
     * Get loading status
     */
    getStatus(): { isLoaded: boolean; isLoading: boolean } {
        return {
            isLoaded: this.isLoaded,
            isLoading: this.loadingPromise !== null && !this.isLoaded
        };
    }
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook for managing code editor state with undo/redo
 */
function useCodeEditor(initialCode: string, maxHistory: number = 50) {
    const [state, setState] = useState<EditorState>({
        code: initialCode,
        history: [initialCode],
        historyIndex: 0
    });

    const setCode = useCallback((newCode: string) => {
        setState(prev => {
            // Don't add to history if code hasn't changed
            if (prev.code === newCode) return prev;

            // Create new history by cutting off any "future" states
            const newHistory = [
                ...prev.history.slice(0, prev.historyIndex + 1),
                newCode
            ].slice(-maxHistory); // Keep only last N items

            return {
                code: newCode,
                history: newHistory,
                historyIndex: newHistory.length - 1
            };
        });
    }, [maxHistory]);

    const undo = useCallback(() => {
        setState(prev => {
            if (prev.historyIndex <= 0) return prev;
            const newIndex = prev.historyIndex - 1;
            return {
                ...prev,
                code: prev.history[newIndex],
                historyIndex: newIndex
            };
        });
    }, []);

    const redo = useCallback(() => {
        setState(prev => {
            if (prev.historyIndex >= prev.history.length - 1) return prev;
            const newIndex = prev.historyIndex + 1;
            return {
                ...prev,
                code: prev.history[newIndex],
                historyIndex: newIndex
            };
        });
    }, []);

    const reset = useCallback(() => {
        setState({
            code: initialCode,
            history: [initialCode],
            historyIndex: 0
        });
    }, [initialCode]);

    return {
        code: state.code,
        setCode,
        undo,
        redo,
        reset,
        canUndo: state.historyIndex > 0,
        canRedo: state.historyIndex < state.history.length - 1
    };
}

/**
 * Hook for auto-saving to localStorage
 */
function useAutoSave(
    code: string,
    enabled: boolean,
    storageKey?: string,
    debounceMs: number = 1000
) {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (!enabled || !storageKey) return;

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Save after debounce delay
        timeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(storageKey, code);
                console.log('💾 Auto-saved to localStorage');
            } catch (error) {
                console.error('Failed to auto-save:', error);
            }
        }, debounceMs);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [code, enabled, storageKey, debounceMs]);
}

/**
 * Hook for debounced syntax highlighting
 */
function useDebouncedHighlight(code: string, delay: number = 300) {
    const [highlightedCode, setHighlightedCode] = useState('');
    // Fix: Use lazy initialization instead of useEffect to detect client-side
    const [isClient] = useState(() => typeof window !== 'undefined');
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        // Only highlight on client-side after hydration
        if (!isClient) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const highlighted = Prism.highlight(code, Prism.languages.python, 'python');
            setHighlightedCode(highlighted);
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [code, delay, isClient]);

    return highlightedCode;
}

/**
 * Hook for managing Pyodide lifecycle
 */
function usePyodide(packages: string[] = ['numpy']) {
    const [status, setStatus] = useState<{
        isLoaded: boolean;
        isLoading: boolean;
        error: string | null;
    }>({
        isLoaded: false,
        isLoading: false,
        error: null
    });

    const managerRef = useRef<PyodideManager>(PyodideManager.getInstance());

    const initialize = useCallback(async () => {
        setStatus(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await managerRef.current.initialize(packages);
            setStatus({ isLoaded: true, isLoading: false, error: null });
        } catch (error) {
            setStatus({
                isLoaded: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to load Python engine'
            });
        }
    }, [packages]);

    const execute = useCallback(async (code: string, timeout?: number) => {
        return await managerRef.current.execute(code, timeout);
    }, []);

    return { ...status, initialize, execute };
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Toolbar component
 */
interface ToolbarProps {
    isRunning: boolean;
    isPyodideLoaded: boolean;
    isPyodideLoading: boolean;
    canUndo: boolean;
    canRedo: boolean;
    onRun: () => void;
    onReset: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onCopy: () => void;
    onDownload: () => void;
    copied: boolean;
    showKeyboardHints: boolean;
    onToggleKeyboardHints: () => void;
}

const Toolbar = memo<ToolbarProps>(({
    isRunning,
    isPyodideLoaded,
    isPyodideLoading,
    canUndo,
    canRedo,
    onRun,
    onReset,
    onUndo,
    onRedo,
    onCopy,
    onDownload,
    copied,
    showKeyboardHints,
    onToggleKeyboardHints
}) => (
    <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b]/50 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                {isRunning ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : isPyodideLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Code2 size={16} />
                )}
            </div>
            <span className="text-xs font-bold text-slate-200 tracking-wide">Python Lab</span>

            {isPyodideLoading && (
                <span className="text-xs text-slate-500 animate-pulse">
                    Loading Python engine...
                </span>
            )}
        </div>

        <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
            >
                <Undo2 size={16} />
            </button>

            <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
                aria-label="Redo"
            >
                <Redo2 size={16} />
            </button>

            <div className="w-px h-6 bg-white/10" />

            {/* Run Button */}
            <button
                onClick={onRun}
                disabled={isRunning}
                className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                    ${isRunning
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : isPyodideLoading
                        ? 'bg-amber-600 text-white cursor-wait'
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/50'}
                `}
                title={isPyodideLoaded ? "Run code (Ctrl+Enter)" : isPyodideLoading ? "Loading Python..." : "Click to run (loads Python on first run)"}
                aria-label="Run code"
            >
                <Play size={12} fill="currentColor" />
                {isRunning ? 'Running...' : isPyodideLoading ? 'Loading...' : 'Run'}
            </button>

            {/* Reset */}
            <button
                onClick={onReset}
                className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5"
                title="Reset to initial code"
                aria-label="Reset code"
            >
                <RotateCcw size={16} />
            </button>

            {/* Copy */}
            <button
                onClick={onCopy}
                className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 relative"
                title="Copy code"
                aria-label="Copy code to clipboard"
            >
                {copied ? (
                    <Check size={16} className="text-emerald-400" />
                ) : (
                    <Copy size={16} />
                )}
            </button>

            {/* Download */}
            <button
                onClick={onDownload}
                className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5"
                title="Download as .py file"
                aria-label="Download code"
            >
                <Download size={16} />
            </button>

            {/* Keyboard Hints Toggle */}
            <button
                onClick={onToggleKeyboardHints}
                className={`p-2 rounded-lg transition-colors ${
                    showKeyboardHints
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
                title="Toggle keyboard shortcuts"
                aria-label="Show keyboard shortcuts"
            >
                <Keyboard size={16} />
            </button>
        </div>
    </div>
));

Toolbar.displayName = 'Toolbar';

/**
 * Keyboard shortcuts hint
 */
const KeyboardHints = memo(() => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="px-4 py-2 bg-blue-500/5 border-b border-blue-500/10 text-xs"
    >
        <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
                <Info size={12} className="text-blue-400" />
                <span className="font-bold">Keyboard Shortcuts:</span>
            </div>
            <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">Enter</kbd>
                <span>= Run</span>
            </div>
            <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">Z</kbd>
                <span>= Undo</span>
            </div>
            <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">Y</kbd>
                <span>= Redo</span>
            </div>
            <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">Tab</kbd>
                <span>= Indent</span>
            </div>
        </div>
    </motion.div>
));

KeyboardHints.displayName = 'KeyboardHints';

/**
 * Output panel component
 */
interface OutputPanelProps {
    output: string;
    error: string | null;
    executionTime: number | null;
}

const OutputPanel = memo<OutputPanelProps>(({ output, error, executionTime }) => (
    <motion.div
        initial={{ height: 0 }}
        animate={{ height: "auto" }}
        exit={{ height: 0 }}
        className="border-t border-white/10 bg-black/50 backdrop-blur-xl overflow-hidden"
    >
        <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/5">
            {/* Left: Title */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <Terminal size={12} />
                <span>Output</span>
            </div>

            {/* Right: Status & Time */}
            <div className="flex items-center gap-3">
                {executionTime !== null && !error && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <Clock size={10} />
                        <span>{executionTime.toFixed(3)}s</span>
                    </div>
                )}

                {error ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        <AlertCircle size={10} />
                        <span>Failed</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 size={10} />
                        <span>Success</span>
                    </div>
                )}
            </div>
        </div>

        <div
            className={`p-4 font-mono text-sm whitespace-pre-wrap ${error ? 'text-rose-300' : 'text-emerald-300'}`}
            role="log"
            aria-live="polite"
            aria-atomic="true"
        >
            {output || error}
        </div>
    </motion.div>
));

OutputPanel.displayName = 'OutputPanel';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const COMMON_STYLES: React.CSSProperties = {
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    padding: '20px',
    letterSpacing: '0px',
    whiteSpace: 'pre',
};

export const LiveCodeEditor: React.FC<LiveCodeEditorProps> = ({
    initialCode,
    onRun,
    onSuccess,
    onError,
    onChange,
    autoSave = false,
    storageKey,
    maxExecutionTime = 30000,
    showKeyboardHints: initialShowHints = false,
    height = 'h-64',
    pythonPackages = ['numpy'],
    readOnly = false,
    setupCode,
    // theme = {} // TODO: Implement theme customization
}) => {
    // ========================================================================
    // STATE & REFS
    // ========================================================================

    const { code, setCode, undo, redo, reset, canUndo, canRedo } = useCodeEditor(initialCode);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [copied, setCopied] = useState(false);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [showKeyboardHintsState, setShowKeyboardHintsState] = useState(initialShowHints);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const lineNumberRef = useRef<HTMLDivElement>(null);

    // ========================================================================
    // CUSTOM HOOKS
    // ========================================================================

    const highlightedCode = useDebouncedHighlight(code, 300);
    const pyodide = usePyodide(pythonPackages);

    useAutoSave(code, autoSave, storageKey);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Load saved code from localStorage on mount
    useEffect(() => {
        if (autoSave && storageKey) {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved && saved !== initialCode) {
                    setCode(saved);
                }
            } catch (error) {
                console.error('Failed to load from localStorage:', error);
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Notify parent of code changes
    useEffect(() => {
        onChange?.(code);
    }, [code, onChange]);

    // ========================================================================
    // CALLBACKS
    // ========================================================================

    const handleScroll = useCallback(() => {
        if (!textareaRef.current) return;
        const { scrollTop, scrollLeft } = textareaRef.current;

        if (preRef.current) {
            preRef.current.scrollTop = scrollTop;
            preRef.current.scrollLeft = scrollLeft;
        }

        if (lineNumberRef.current) {
            lineNumberRef.current.scrollTop = scrollTop;
        }
    }, []);

    const handleRun = useCallback(async () => {
        // Don't run if already running
        if (isRunning) return;

        setIsRunning(true);
        setError(null);
        setOutput("");
        setExecutionTime(null);

        try {
            if (onRun) {
                const simulatedOutput = onRun(code) ?? "";
                setOutput(simulatedOutput);
                onSuccess?.(simulatedOutput);
                setExecutionTime(0);
                return;
            }

            // Initialize Pyodide on first run (lazy loading)
            if (!pyodide.isLoaded) {
                console.log('🔄 Starting Pyodide initialization...');
                await pyodide.initialize();
                console.log('✅ Pyodide initialization complete');
            }

            // Now run the code
            console.log('▶️ Running Python code...');

            const fullCode = setupCode ? `${setupCode}\n${code}` : code;
            const result = await pyodide.execute(fullCode, maxExecutionTime);

            if (result.error) {
                setError(result.error);
                setOutput(result.error);
                onError?.(result.error);
                console.error('❌ Execution error:', result.error);
            } else {
                setOutput(result.output);
                onSuccess?.(result.output);
                console.log('✅ Execution successful');
            }

            setExecutionTime(result.executionTime);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMsg);
            setOutput(errorMsg);
            onError?.(errorMsg);
            console.error('❌ Unexpected error:', err);
        } finally {
            setIsRunning(false);
        }
    }, [code, isRunning, pyodide, maxExecutionTime, onRun, onSuccess, onError]);

    const handleReset = useCallback(() => {
        reset();
        setOutput("");
        setError(null);
        setExecutionTime(null);
    }, [reset]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [code]);

    const handleDownload = useCallback(() => {
        const blob = new Blob([code], { type: 'text/x-python' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code-${Date.now()}.py`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [code]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Ctrl/Cmd + Enter: Run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleRun();
            return;
        }

        // Ctrl/Cmd + Z: Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
            return;
        }

        // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            redo();
            return;
        }

        // Tab: Indent
        if (e.key === 'Tab') {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const newCode = code.substring(0, start) + "    " + code.substring(end);
            setCode(newCode);
            setTimeout(() => {
                target.selectionStart = target.selectionEnd = start + 4;
            }, 0);
        }
    }, [code, setCode, handleRun, undo, redo]);

    // ========================================================================
    // MEMOIZED VALUES
    // ========================================================================

    const lineNumbers = useMemo(
        () => code.split('\n').map((_, i) => i + 1).join('\n'),
        [code]
    );

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div
            className={`
                relative my-12 rounded-2xl overflow-hidden transition-all duration-500
                bg-[#0B1120] border group/container text-left
                ${isFocused ? 'border-blue-500/50 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]' : 'border-white/10 shadow-2xl'}
            `}
            dir="ltr"
            role="region"
            aria-label="Interactive Python code editor"
        >
            {/* Background Glow */}
            <div
                className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none opacity-50"
                aria-hidden="true"
            />

            {/* Toolbar */}
            <Toolbar
                isRunning={isRunning}
                isPyodideLoaded={pyodide.isLoaded}
                isPyodideLoading={pyodide.isLoading}
                canUndo={canUndo}
                canRedo={canRedo}
                onRun={handleRun}
                onReset={handleReset}
                onUndo={undo}
                onRedo={redo}
                onCopy={handleCopy}
                onDownload={handleDownload}
                copied={copied}
                showKeyboardHints={showKeyboardHintsState}
                onToggleKeyboardHints={() => setShowKeyboardHintsState(prev => !prev)}
            />

            {/* Keyboard Shortcuts Hint */}
            <AnimatePresence>
                {showKeyboardHintsState && <KeyboardHints />}
            </AnimatePresence>

            {/* Editor Area */}
            <div className={`relative ${height} bg-[#0B1120] text-left flex`}>
                {/* Line Numbers */}
                <div
                    ref={lineNumberRef}
                    className="h-full border-r border-white/5 bg-[#0B1120] text-slate-600 select-none overflow-hidden text-right"
                    aria-hidden="true"
                    style={{
                        ...COMMON_STYLES,
                        width: '48px',
                        paddingRight: '12px',
                        paddingLeft: '0',
                    }}
                >
                    {lineNumbers}
                </div>

                {/* Code Container */}
                <div className="relative flex-1 h-full group">
                    {/* Syntax Highlighted Code */}
                    <pre
                        ref={preRef}
                        suppressHydrationWarning
                        aria-hidden="true"
                        className="absolute inset-0 m-0 overflow-hidden pointer-events-none text-left w-full h-full"
                        style={COMMON_STYLES}
                        tabIndex={-1}
                    >
                        <code
                            suppressHydrationWarning
                            className="language-python bg-transparent! text-slate-300!"
                            style={{
                                fontFamily: COMMON_STYLES.fontFamily,
                                fontSize: COMMON_STYLES.fontSize,
                                lineHeight: COMMON_STYLES.lineHeight,
                                padding: 0,
                                margin: 0,
                                display: 'block'
                            }}
                            dangerouslySetInnerHTML={{ __html: highlightedCode || code }}
                        />
                    </pre>

                    {/* Textarea Input */}
                    <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onScroll={handleScroll}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        readOnly={readOnly}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-blue-400 outline-none overflow-auto z-10"
                        style={{
                            ...COMMON_STYLES,
                            color: 'transparent',
                        }}
                        aria-label="Python code editor"
                        aria-describedby="editor-instructions"
                    />

                    {/* Screen reader instructions */}
                    <div id="editor-instructions" className="sr-only">
                        Use Ctrl+Enter to run code. Use Tab to indent. Use Ctrl+Z to undo and Ctrl+Y to redo.
                    </div>
                </div>
            </div>

            {/* Output Panel */}
            <AnimatePresence>
                {(output || error) && (
                    <OutputPanel
                        output={output}
                        error={error}
                        executionTime={executionTime}
                    />
                )}
            </AnimatePresence>

            {/* Pyodide Error */}
            {pyodide.error && (
                <div className="px-4 py-3 bg-rose-500/10 border-t border-rose-500/20 text-rose-300 text-sm">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span className="font-bold">Engine Error:</span>
                        <span>{pyodide.error}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Set display name for debugging
LiveCodeEditor.displayName = 'LiveCodeEditor';

// Export types
export type { PyodideInterface, ExecutionResult };

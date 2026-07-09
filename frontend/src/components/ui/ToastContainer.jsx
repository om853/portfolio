import React from 'react';
import { useToast } from '../../context/ToastContext';

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl border text-sm font-bold flex items-center gap-3 animate-slide-in ${
                        toast.type === 'success'
                            ? 'bg-green-900/90 border-green-500/30 text-green-200'
                            : toast.type === 'error'
                            ? 'bg-red-900/90 border-red-500/30 text-red-200'
                            : toast.type === 'warning'
                            ? 'bg-yellow-900/90 border-yellow-500/30 text-yellow-200'
                            : 'bg-gray-900/90 border-gray-500/30 text-gray-200'
                    }`}
                >
                    <span className="material-symbols-outlined text-lg shrink-0">
                        {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'info'}
                    </span>
                    <span className="flex-1">{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;

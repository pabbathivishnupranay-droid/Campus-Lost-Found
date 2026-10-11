import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/80 text-emerald-200',
          iconColor: 'text-emerald-400',
        };
      case 'error':
        return {
          icon: AlertTriangle,
          border: 'border-red-500/40',
          bg: 'bg-red-950/80 text-red-200',
          iconColor: 'text-red-400',
        };
      default:
        return {
          icon: Info,
          border: 'border-sky-500/40',
          bg: 'bg-sky-950/80 text-sky-200',
          iconColor: 'text-sky-400',
        };
    }
  };

  const config = getStyle(toast.type);
  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${config.bg} ${config.border}`}>
        <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
        <span className="text-xs font-medium max-w-sm">{toast.message}</span>
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

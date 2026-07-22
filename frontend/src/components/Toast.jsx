import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useAuth();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#10b981" />,
    danger: <AlertCircle size={18} color="#ef4444" />,
    info: <Info size={18} color="#3b82f6" />
  };

  const bgColors = {
    success: 'rgba(16, 185, 129, 0.95)',
    danger: 'rgba(239, 68, 68, 0.95)',
    info: 'rgba(59, 130, 246, 0.95)'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.25rem',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)',
      fontSize: '0.9rem',
      fontWeight: 500,
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {icons[toast.type] || icons.info}
      <span>{toast.message}</span>
    </div>
  );
}

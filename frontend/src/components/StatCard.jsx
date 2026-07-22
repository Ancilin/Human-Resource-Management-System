import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#6366f1' }) {
  return (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem' }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: 'var(--radius-md)',
        background: `${color}18`,
        color: color,
        border: `1px solid ${color}35`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {Icon && <Icon size={26} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase' }}>
          {title}
        </span>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.1rem 0' }}>{value}</h3>
        {subtitle && <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
    </div>
  );
}

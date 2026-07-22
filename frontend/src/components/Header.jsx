import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User } from 'lucide-react';

export default function Header({ title }) {
  const { user } = useAuth();
  const emp = user?.employee;

  const todayString = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      sticky: 'top'
    }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{todayString}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.1rem',
            overflow: 'hidden'
          }}>
            {emp?.avatar ? (
              <img src={emp.avatar} alt={emp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (emp?.name || user?.email || 'U').charAt(0).toUpperCase()
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{emp?.name || user?.email}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp?.designation || user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

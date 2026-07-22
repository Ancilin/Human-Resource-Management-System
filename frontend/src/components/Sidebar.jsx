import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  UserCircle,
  LogOut,
  Sun,
  Moon,
  Building2,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const { user, isHR, logout, theme, toggleTheme } = useAuth();

  const hrNavItems = [
    { id: 'dashboard', label: 'HR Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance Logs', icon: Clock },
    { id: 'leaves', label: 'Leave Requests', icon: CalendarDays }
  ];

  const employeeNavItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'My Attendance', icon: Clock },
    { id: 'leaves', label: 'Apply Leave', icon: CalendarDays },
    { id: 'profile', label: 'My Profile', icon: UserCircle }
  ];

  const navItems = isHR ? hrNavItems : employeeNavItems;

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '1.5rem 1rem',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <div style={{
          background: 'var(--accent-gradient)',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <Building2 size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Workforce HR</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Portal v1.0</span>
        </div>
      </div>

      {/* Role Indicator Badge */}
      <div style={{
        padding: '0.5rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        background: isHR ? 'rgba(99, 102, 241, 0.12)' : 'rgba(16, 185, 129, 0.12)',
        border: `1px solid ${isHR ? 'rgba(99, 102, 241, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <ShieldAlert size={16} color={isHR ? '#6366f1' : '#10b981'} />
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Access Level</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isHR ? '#6366f1' : '#10b981' }}>{user?.role} PORTAL</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all var(--transition-fast)',
                textAlign: 'left'
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Theme & Logout Footer */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 500
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Toggle</span>
        </button>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            background: 'var(--color-danger-bg)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

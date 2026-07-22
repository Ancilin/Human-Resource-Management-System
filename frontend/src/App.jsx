import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

// HR Pages
import HRDashboard from './pages/HRDashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import HRAttendance from './pages/HRAttendance';
import HRLeaves from './pages/HRLeaves';

// Employee Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeAttendance from './pages/EmployeeAttendance';
import EmployeeLeaves from './pages/EmployeeLeaves';
import Profile from './pages/Profile';

import './styles/global.css';
import './styles/components.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Workforce HRMS ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b1320',
          color: '#ffffff',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem', borderRadius: '16px', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', marginBottom: '1rem' }}>
              System Recovery Mode
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              An unexpected render error occurred. Click below to clear cache and reload the application portal.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                background: '#10b981',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Reset & Reload HRMS Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const { user, token, loading, isHR } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b1320',
        color: '#ffffff',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(16, 185, 129, 0.2)',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>
          Initializing Workforce HRMS...
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <>
        <Login />
        <Toast />
      </>
    );
  }

  const renderContent = () => {
    if (isHR) {
      switch (currentTab) {
        case 'dashboard':
          return <HRDashboard setCurrentTab={setCurrentTab} />;
        case 'employees':
          return <EmployeeManagement />;
        case 'attendance':
          return <HRAttendance />;
        case 'leaves':
          return <HRLeaves />;
        default:
          return <HRDashboard setCurrentTab={setCurrentTab} />;
      }
    } else {
      switch (currentTab) {
        case 'dashboard':
          return <EmployeeDashboard setCurrentTab={setCurrentTab} />;
        case 'attendance':
          return <EmployeeAttendance />;
        case 'leaves':
          return <EmployeeLeaves />;
        case 'profile':
          return <Profile />;
        default:
          return <EmployeeDashboard setCurrentTab={setCurrentTab} />;
      }
    }
  };

  const pageTitles = {
    dashboard: isHR ? 'HR Executive Dashboard' : 'Employee Overview',
    employees: 'Workforce Directory',
    attendance: isHR ? 'Company Attendance Logs' : 'Personal Attendance History',
    leaves: isHR ? 'Leave Approvals Queue' : 'Leave Requests',
    profile: 'Personal Profile Settings'
  };

  return (
    <div className="app-layout">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="main-content">
        <Header title={pageTitles[currentTab] || 'HRMS Portal'} />
        <main className="page-container">
          {renderContent()}
        </main>
      </div>

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

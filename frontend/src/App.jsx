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

function MainApp() {
  const { user, token, loading, isHR } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontSize: '1.1rem',
        fontWeight: 600
      }}>
        Initializing Workforce HRMS...
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
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

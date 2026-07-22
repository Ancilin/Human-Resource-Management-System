import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { Users, UserCheck, CalendarX, Clock, ArrowRight, UserPlus, CheckCircle, FileText, Zap, ShieldCheck } from 'lucide-react';

export default function HRDashboard({ setCurrentTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.getHRDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load HR dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>
        Loading HR Executive Dashboard...
      </div>
    );
  }

  const { metrics, recentActivity, recentLeaves } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 3D Isometric Top Banner */}
      <div className="hr-dashboard-3d-banner">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            <Zap size={14} /> HR Operations Suite v2.0
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Welcome Back, HR Administrator
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.925rem', marginTop: '0.35rem', maxWidth: '500px', lineHeight: 1.5 }}>
            Real-time workforce intelligence, automated leave processing, and company-wide attendance monitoring.
          </p>

          {/* Quick Action Pills */}
          <div className="banner-quick-actions">
            <button className="action-pill-btn" onClick={() => setCurrentTab('employees')}>
              <UserPlus size={15} /> + Add Employee
            </button>
            <button className="action-pill-btn" onClick={() => setCurrentTab('leaves')}>
              <CheckCircle size={15} /> Approve Leaves
            </button>
            <button className="action-pill-btn" onClick={() => setCurrentTab('attendance')}>
              <Clock size={15} /> Attendance Logs
            </button>
          </div>
        </div>

        {/* Right 3D Visual Graphic Container */}
        <div className="banner-3d-img-wrapper">
          <img
            src="/assets/hr_3d_isometric_banner.jpg"
            alt="3D HR Analytics Software Banner"
          />
        </div>
      </div>

      {/* Metrics Row with 3D Card Hover */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="stat-card-3d">
          <StatCard
            title="Total Workforce"
            value={metrics?.totalEmployees || 0}
            subtitle="Active registered staff"
            icon={Users}
            color="#6366f1"
          />
          <div className="animated-progress-container">
            <div className="animated-progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="stat-card-3d">
          <StatCard
            title="Present Today"
            value={metrics?.presentToday || 0}
            subtitle="Punched in today"
            icon={UserCheck}
            color="#10b981"
          />
          <div className="animated-progress-container">
            <div className="animated-progress-fill" style={{ width: '92%', background: '#10b981' }}></div>
          </div>
        </div>

        <div className="stat-card-3d">
          <StatCard
            title="On Leave Today"
            value={metrics?.onLeaveToday || 0}
            subtitle="Approved leave balance"
            icon={CalendarX}
            color="#f59e0b"
          />
          <div className="animated-progress-container">
            <div className="animated-progress-fill" style={{ width: '15%', background: '#f59e0b' }}></div>
          </div>
        </div>

        <div className="stat-card-3d">
          <StatCard
            title="Pending Requests"
            value={metrics?.pendingLeaves || 0}
            subtitle="Requires HR action"
            icon={Clock}
            color="#ef4444"
          />
          <div className="animated-progress-container">
            <div className="animated-progress-fill" style={{ width: `${Math.min((metrics?.pendingLeaves || 0) * 20, 100)}%`, background: '#ef4444' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Attendance Stream */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Today's Attendance Activity</h3>
            <button
              onClick={() => setCurrentTab('attendance')}
              style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 600 }}>{log.employee_name}</td>
                      <td>{log.department}</td>
                      <td>{log.check_in || '--:--'}</td>
                      <td>{log.check_out || 'Active'}</td>
                      <td>
                        <span className={`badge ${
                          log.status === 'Present' ? 'badge-success' : log.status === 'On Leave' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No attendance activity recorded for today yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Leave Requests Panel */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Pending Leave Approvals</h3>
            <button
              onClick={() => setCurrentTab('leaves')}
              style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
            >
              Manage <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentLeaves && recentLeaves.length > 0 ? (
              recentLeaves.map((req) => (
                <div key={req.id} style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{req.employee_name}</span>
                    <span className="badge badge-warning">{req.leave_type}</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    {req.start_date} to {req.end_date} ({req.days_count} day{req.days_count > 1 ? 's' : ''})
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{req.reason}"
                  </p>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem' }}>
                All clear! No pending leave requests.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

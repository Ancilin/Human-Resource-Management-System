import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { Clock, CheckCircle2, LogOut as LogOutIcon, CalendarDays, Bell, User, Building, Award } from 'lucide-react';

export default function EmployeeDashboard({ setCurrentTab }) {
  const { user, showToast } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.getEmployeeDashboard();
      setDashboardData(res);
    } catch (err) {
      console.error('Failed to load employee dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await api.checkIn();
      showToast(res.message, 'success');
      fetchDashboard();
    } catch (err) {
      showToast(err.message || 'Check-in failed', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await api.checkOut();
      showToast(res.message, 'success');
      fetchDashboard();
    } catch (err) {
      showToast(err.message || 'Check-out failed', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your employee portal...</div>;
  }

  const { profile, todayAttendance, leaveStats, notifications } = dashboardData || {};
  const isCheckedIn = !!todayAttendance?.check_in;
  const isCheckedOut = !!todayAttendance?.check_out;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Employee Profile Hero Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%), var(--bg-card)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 800,
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
          }}>
            {(profile?.name || 'E').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome back, {profile?.name}!</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building size={16} /> {profile?.department}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Award size={16} /> {profile?.designation}
              </span>
              <span>•</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-primary)' }}>
                {profile?.employee_code}
              </span>
            </div>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={() => setCurrentTab('profile')}>
          <User size={16} /> Edit My Profile
        </button>
      </div>

      {/* Main Employee Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Attendance Punch Widget */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--accent-primary)" /> Today's Attendance
            </h3>
            <span className={`badge ${
              isCheckedOut ? 'badge-info' : isCheckedIn ? 'badge-success' : 'badge-warning'
            }`}>
              {isCheckedOut ? 'Completed Day' : isCheckedIn ? 'Currently Clocked In' : 'Not Punched In'}
            </span>
          </div>

          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center'
          }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true, fontWeight: 600 }}>CHECK IN</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: isCheckedIn ? 'var(--color-success)' : 'var(--text-muted)' }}>
                {todayAttendance?.check_in || '--:--'}
              </span>
            </div>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true, fontWeight: 600 }}>CHECK OUT</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: isCheckedOut ? 'var(--color-info)' : 'var(--text-muted)' }}>
                {todayAttendance?.check_out || '--:--'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {!isCheckedIn ? (
              <button
                className="btn btn-primary"
                onClick={handleCheckIn}
                disabled={actionLoading}
                style={{ flex: 1, padding: '0.85rem' }}
              >
                <CheckCircle2 size={18} /> Clock In Now
              </button>
            ) : !isCheckedOut ? (
              <button
                className="btn btn-danger"
                onClick={handleCheckOut}
                disabled={actionLoading}
                style={{ flex: 1, padding: '0.85rem' }}
              >
                <LogOutIcon size={18} /> Clock Out Now
              </button>
            ) : (
              <div style={{ width: '100%', textAlign: 'center', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.9rem' }}>
                ✓ Today's work shift has been logged ({todayAttendance?.total_hours || 0} hrs).
              </div>
            )}
          </div>
        </div>

        {/* Leave Balance Overview Widget */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarDays size={20} color="#f59e0b" /> Leave Quota Summary
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentTab('leaves')}>
              Apply Leave
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Annual Quota</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{leaveStats?.annualQuota || 24}</span>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Used Days</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-warning)' }}>{leaveStats?.usedDays || 0}</span>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Remaining</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)' }}>{leaveStats?.remainingBalance || 24}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} color="var(--color-info)" /> System Notifications & Updates
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem', borderRadius: '50%', color: 'var(--color-info)' }}>
                  <Bell size={14} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{n.title}</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{n.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>No new notifications.</div>
          )}
        </div>
      </div>
    </div>
  );
}

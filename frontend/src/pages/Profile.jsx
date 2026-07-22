import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Lock, Mail, Phone, Building, Briefcase, Calendar, ShieldCheck, KeyRound, Save, Eye, EyeOff } from 'lucide-react';

export default function Profile() {
  const { user, showToast, updateUserProfile } = useAuth();
  const emp = user?.employee;

  // Profile Edit State
  const [name, setName] = useState(emp?.name || '');
  const [phone, setPhone] = useState(emp?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Independent Password Visibility Toggles
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (emp) {
      setName(emp.name);
      setPhone(emp.phone);
    }
  }, [emp]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.updateSelfProfile({ name, phone });
      updateUserProfile(res.employee);
      showToast('Profile information updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'danger');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in password fields', 'danger');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match', 'danger');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'danger');
      return;
    }

    setSavingPassword(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'danger');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Basic Profile Details & Edit */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={20} color="var(--accent-primary)" /> Personal Profile
        </h3>

        {/* Readonly Info Summary */}
        <div style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-input)',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>EMPLOYEE CODE</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)' }}>{emp?.employee_code || 'N/A'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>SYSTEM ROLE</span>
            <span className="badge badge-info">{user?.role}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>DEPARTMENT</span>
            <span style={{ fontWeight: 600 }}>{emp?.department || 'N/A'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>DESIGNATION</span>
            <span style={{ fontWeight: 600 }}>{emp?.designation || 'N/A'}</span>
          </div>
        </div>

        <form onSubmit={handleProfileSave}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Work Email (Read Only)</label>
            <input
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label>Contact Phone</label>
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={savingProfile}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Security & Password Change */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <KeyRound size={20} color="var(--color-warning)" /> Security & Password
        </h3>

        <form onSubmit={handlePasswordSave}>
          <div className="form-group">
            <label>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPass ? 'text' : 'password'}
                className="form-control"
                style={{ paddingRight: '40px' }}
                placeholder="Type your current password..."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                title={showCurrentPass ? 'Hide Current Password' : 'Show Current Password'}
              >
                {showCurrentPass ? <EyeOff size={18} color="var(--accent-primary)" /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPass ? 'text' : 'password'}
                className="form-control"
                style={{ paddingRight: '40px' }}
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                title={showNewPass ? 'Hide New Password' : 'Show New Password'}
              >
                {showNewPass ? <EyeOff size={18} color="var(--accent-primary)" /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPass ? 'text' : 'password'}
                className="form-control"
                style={{ paddingRight: '40px' }}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                title={showConfirmPass ? 'Hide Confirm Password' : 'Show Confirm Password'}
              >
                {showConfirmPass ? <EyeOff size={18} color="var(--accent-primary)" /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={savingPassword}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {savingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}



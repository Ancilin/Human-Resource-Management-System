import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, UserCheck, ShieldCheck, Eye, EyeOff, Zap, Users, CalendarDays, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const auth = useAuth() || {};
  const login = auth.login;
  const showToast = auth.showToast;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Frontend Login submitted:', { email, password });
    if (!email || !password) {
      setError('Please enter work email address and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (login) {
        await login(email, password);
      }
    } catch (err) {
      console.error('Login submit handler caught error:', err);
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
      if (showToast) showToast(err.message || 'Login failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="login-split-container">
      {/* LEFT PANEL: 3D Artwork, Feature Showcase & Motion Badges */}
      <div className="login-feature-panel">
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Workforce HRMS</h1>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 }}>Next-Gen Human Capital Operating System</span>
          </div>
        </div>

        {/* Headline & 3D Artwork */}
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Empowering Modern <span className="text-gradient">Workforce & HR</span> Excellence
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '520px' }}>
            Streamline employee directory management, automated attendance logs, instant leave approvals, and executive payroll analytics in one high-performance platform.
          </p>

          {/* 3D Render Isometric Artwork Container */}
          <div className="login-feature-artwork">
            <img
              src="/assets/login_3d_artwork.jpg"
              alt="3D HR Analytics & Workforce Platform"
            />
            {/* Overlay 3D Floating Badge */}
            <div
              className="floating-3d-badge"
              style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Real-Time Geo-Attendance</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>98.4% Active Workforce Online</div>
              </div>
            </div>
          </div>

          {/* Feature Chips */}
          <div className="login-feature-chips">
            <div className="feature-chip">
              <Users size={16} color="#6366f1" /> 100% Digital Employee Files
            </div>
            <div className="feature-chip">
              <CalendarDays size={16} color="#10b981" /> Instant Leave Approvals
            </div>
            <div className="feature-chip">
              <ShieldCheck size={16} color="#f59e0b" /> Payroll & Salary Reports
            </div>
            <div className="feature-chip">
              <CheckCircle2 size={16} color="#3b82f6" /> 256-Bit SSL Enterprise Security
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            All HR Systems Operational
          </div>
          <div>© 2026 Workforce HRMS</div>
        </div>
      </div>

      {/* RIGHT PANEL: Form & Login Controls */}
      <div className="login-form-panel">
        <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Portal Sign In</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Access your HR Executive or Employee Dashboard
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--color-danger)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Work Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Quick Demo Presets */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                Quick Demo Presets
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                Pass: hr123543
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('hr@company.com', 'hr123543')}
                style={{
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  color: '#6366f1',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ShieldCheck size={15} /> HR Admin
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('priya96@gmail.com', 'Password123!')}
                style={{
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#10b981',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <UserCheck size={15} /> Employee (Priya)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

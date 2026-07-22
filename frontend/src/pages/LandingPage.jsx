import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Users, BarChart3, Clock, CheckCircle2, Building2, Mail, Phone, MapPin } from 'lucide-react';

export default function LandingPage({ onOpenAuthModal, onGoToDashboard }) {
  // ROI Calculator state
  const [employeeCount, setEmployeeCount] = useState(45);
  const [avgSalary, setAvgSalary] = useState(4500);

  // Calculations
  const hoursSavedPerYear = Math.round(employeeCount * 36);
  const costSavingsPerYear = Math.round(hoursSavedPerYear * (avgSalary / 160) * 0.45);

  return (
    <div className="zeero-landing-wrapper">
      {/* 1. HERO SECTION */}
      <section className="zeero-hero-section">
        <div className="zeero-hero-container">
          {/* Left Text Column */}
          <div>
            <div className="pill-badge">
              <span className="pill-badge-dot"></span>
              ABOUT ZEEROSTOCK HRMS
            </div>

            <h1 className="zeero-hero-headline">
              Transforming <span className="highlight-green">Global Workforce</span> Operations
            </h1>

            <p className="zeero-hero-subtitle">
              Helping businesses source talent smarter, liquidate HR bottlenecks faster, and maximize employee value across all departments.
            </p>

            <div className="zeero-hero-actions">
              <button
                className="hero-cta-dark"
                onClick={() => onOpenAuthModal('signup')}
              >
                Sign Up now <ArrowRight size={18} />
              </button>

              <button
                className="hero-cta-outline"
                onClick={() => onOpenAuthModal('login')}
              >
                Contact Us / Demo
              </button>
            </div>

            {/* Micro Feature Badges */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#10b981" /> 100% Real-Time Attendance
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#10b981" /> Automated Payroll Calculation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#10b981" /> One-Click Leave Approvals
              </div>
            </div>
          </div>

          {/* Right Visual Graphic Column */}
          <div className="zeero-hero-visual">
            <div className="hero-img-wrapper">
              <img
                src="/assets/hr_hero_illustration.jpg"
                alt="Transforming Global Workforce Trade - HRMS"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. MISSION SECTION ("Why We Built Zeerostock") */}
      <section className="zeero-mission-section">
        <div className="zeero-section-header">
          <div className="pill-badge" style={{ display: 'inline-flex' }}>
            <span className="pill-badge-dot"></span>
            OUR MISSION
          </div>
          <h2 className="zeero-section-title">
            Why We Built <span>Zeerostock HRMS</span>
          </h2>
        </div>

        <div className="mission-card-grid">
          {/* Card 1 */}
          <div className="mission-card">
            <div className="mission-card-img-container">
              <img src="/assets/mission_fragmented_hr.jpg" alt="Fragmented Handling" />
            </div>
            <div className="number-badge">1</div>
            <h3 className="mission-card-title">Fragmented Handling</h3>
            <p className="mission-card-desc">
              Before Zeerostock, managing workforce operations was a series of chaotic emails, manual paper files, and fragmented spreadsheets.
            </p>
          </div>

          {/* Card 2 */}
          <div className="mission-card">
            <div className="mission-card-img-container">
              <img src="/assets/mission_payroll_pricing.jpg" alt="Opaque Pricing" />
            </div>
            <div className="number-badge">2</div>
            <h3 className="mission-card-title">Opaque Pricing & Payroll</h3>
            <p className="mission-card-desc">
              Sellers and HR managers never knew true productivity metrics, while leadership struggled to calculate transparent salary distributions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="mission-card">
            <div className="mission-card-img-container">
              <img src="/assets/mission_fast_logistics.jpg" alt="Friction-Heavy Logistics" />
            </div>
            <div className="number-badge">3</div>
            <h3 className="mission-card-title">Friction-Heavy Approvals</h3>
            <p className="mission-card-desc">
              Closing a leave or payroll cycle took weeks. We built a unified platform that resolves leave requests and approvals in hours.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE ROI CALCULATOR SECTION */}
      <section className="zeero-roi-section">
        <div className="roi-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="pill-badge" style={{ display: 'inline-flex' }}>
              <span className="pill-badge-dot"></span>
              ESTIMATE YOUR RETURN ON INVESTMENT
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
              Calculate Your <span style={{ color: '#10b981' }}>HR Efficiency Savings</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
              See how much time and financial budget Zeerostock HRMS saves your business every year.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            {/* Controls Left */}
            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, color: '#0f172a' }}>
                  <span>Total Employee Workforce:</span>
                  <span style={{ color: '#10b981', fontSize: '1.1rem' }}>{employeeCount} Employees</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, color: '#0f172a' }}>
                  <span>Average Monthly Salary per Employee:</span>
                  <span style={{ color: '#10b981', fontSize: '1.1rem' }}>${avgSalary.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="15000"
                  step="250"
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Results Right */}
            <div style={{ background: 'linear-gradient(135deg, #0b1320 0%, #1e293b 100%)', color: '#ffffff', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.25)' }}>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10b981', fontWeight: 700, marginBottom: '1rem' }}>
                Estimated Annual Impact
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
                  ${costSavingsPerYear.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Annual Estimated Cost Reduction
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>
                  {hoursSavedPerYear.toLocaleString()} Hours
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  HR Administrative Time Saved / Year
                </div>
              </div>

              <button
                className="zeero-signup-btn"
                style={{ width: '100%', textAlign: 'center', padding: '0.85rem' }}
                onClick={() => onOpenAuthModal('login')}
              >
                Launch Live HRMS Portal <ArrowRight size={16} style={{ display: 'inline', marginLeft: 6 }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="zeero-footer">
        <div className="footer-container">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={22} color="#fff" />
              </div>
              <span>Zeero</span>stock HRMS™
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '320px' }}>
              The next-generation B2B workforce management platform for modern teams, HR managers, and corporate liquidators.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><a href="#employees" onClick={(e) => { e.preventDefault(); onOpenAuthModal('login'); }}>Employee Directory</a></li>
              <li><a href="#attendance" onClick={(e) => { e.preventDefault(); onOpenAuthModal('login'); }}>Attendance Tracking</a></li>
              <li><a href="#payroll" onClick={(e) => { e.preventDefault(); onOpenAuthModal('login'); }}>Payroll Automation</a></li>
              <li><a href="#leaves" onClick={(e) => { e.preventDefault(); onOpenAuthModal('login'); }}>Leave Management</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>About Zeerostock</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Contact & Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#10b981" /> support@zeerostock-hrms.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#10b981" /> +1 (800) 555-0199
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#10b981" /> Silicon Valley, CA, USA
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 Zeerostock HRMS Technologies Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            All HR Systems Operational
          </div>
        </div>
      </footer>
    </div>
  );
}

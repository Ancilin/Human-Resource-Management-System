import React, { useState } from 'react';
import { Building2, Search, Globe, MessageSquare, ArrowRight, UserCheck, ShieldCheck, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuthModal, user, isHR }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching HRMS directory for: "${searchQuery}"`);
    }
  };

  return (
    <>
      <nav className="zeero-navbar">
        {/* Brand Logo */}
        <div className="zeero-brand" onClick={() => setActiveTab('home')}>
          <div className="zeero-brand-icon">
            <Building2 size={20} />
          </div>
          <span>Zeero</span>stock HRMS™
        </div>

        {/* Navigation Links */}
        <ul className="zeero-nav-links">
          <li>
            <span
              className={`zeero-nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </span>
          </li>
          <li>
            <span
              className={`zeero-nav-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About Us
            </span>
          </li>
          <li>
            <span
              className={`zeero-nav-link ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              Workforce
            </span>
          </li>
          <li>
            <span
              className={`zeero-nav-link ${activeTab === 'departments' ? 'active' : ''}`}
              onClick={() => setActiveTab('departments')}
            >
              Departments
            </span>
          </li>
          <li>
            <span
              className={`zeero-nav-link ${activeTab === 'roi' ? 'active' : ''}`}
              onClick={() => setActiveTab('roi')}
            >
              ROI & Analytics
            </span>
          </li>
          <li>
            <span
              className={`zeero-nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </span>
          </li>
        </ul>

        {/* Right Navigation Actions */}
        <div className="zeero-nav-actions">
          {/* Search Bar */}
          <form className="zeero-search-bar" onSubmit={handleSearchSubmit}>
            <Search size={15} className="zeero-search-icon" />
            <input
              type="text"
              className="zeero-search-input"
              placeholder="Search Employees, Payroll, ROI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Language Selector */}
          <div
            className="zeero-lang-btn"
            title="Change Language"
            onClick={() => setCurrentLang(currentLang === 'EN' ? 'ES' : 'EN')}
          >
            <Globe size={15} />
            <span>{currentLang}</span>
          </div>

          {/* WhatsApp Support Button */}
          <div
            className="zeero-whatsapp-btn"
            title="Contact HR Support on WhatsApp"
            onClick={() => setShowWhatsappModal(true)}
          >
            <MessageSquare size={16} />
          </div>

          {/* Auth Action Buttons */}
          {user ? (
            <button
              className="zeero-signup-btn"
              onClick={() => setActiveTab('dashboard')}
            >
              Go to HR Portal <ArrowRight size={14} style={{ marginLeft: 4, display: 'inline' }} />
            </button>
          ) : (
            <>
              <button
                className="zeero-login-btn"
                onClick={() => onOpenAuthModal('login')}
              >
                Login
              </button>
              <button
                className="zeero-signup-btn"
                onClick={() => onOpenAuthModal('signup')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* WhatsApp Modal */}
      {showWhatsappModal && (
        <div className="modal-overlay" onClick={() => setShowWhatsappModal(false)}>
          <div className="modal-content" style={{ maxWidth: '420px', padding: '1.5rem', background: '#0b1320', color: '#fff' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={18} color="#fff" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>HR Support Desk</h3>
              </div>
              <button onClick={() => setShowWhatsappModal(false)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Connect directly with our HR team on WhatsApp for instant leave approvals, payroll assistance, or system onboarding support.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://wa.me/15551234567?text=Hello%20HR%20Team%2C%20I%20need%20assistance"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, background: '#25d366', borderColor: '#25d366', textDecoration: 'none', textAlign: 'center' }}
              >
                Open WhatsApp Chat
              </a>
              <button className="btn btn-secondary" onClick={() => setShowWhatsappModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

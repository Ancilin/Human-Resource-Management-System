import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { CalendarPlus, CalendarDays, Clock, CheckCircle2 } from 'lucide-react';

export default function EmployeeLeaves() {
  const { showToast } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    leave_type: 'Paid Leave',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const fetchMyLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.getMyLeaves();
      setLeaves(res.leaves);
      setStats(res.stats);
    } catch (err) {
      showToast('Failed to load leave history', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason) {
      showToast('Please provide a reason for your leave request', 'danger');
      return;
    }

    try {
      await api.applyLeave(formData);
      showToast('Leave request submitted successfully!', 'success');
      setIsApplyModalOpen(false);
      setFormData({
        leave_type: 'Paid Leave',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        reason: ''
      });
      fetchMyLeaves();
    } catch (err) {
      showToast(err.message || 'Failed to submit leave request', 'danger');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Quota Header & Apply Action */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Annual Allocation</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.annualQuota || 24} Days</h3>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approved Used</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-warning)' }}>{stats.usedDays || 0} Days</h3>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available Balance</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success)' }}>{stats.remainingBalance || 24} Days</h3>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setIsApplyModalOpen(true)}>
          <CalendarPlus size={18} /> Apply For Leave
        </button>
      </div>

      {/* Leave Applications History */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>My Leave Application History</h3>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Applied On</th>
                <th>Leave Type</th>
                <th>Dates Range</th>
                <th>Days Count</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Manager / HR Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading leave history...</td>
                </tr>
              ) : leaves.length > 0 ? (
                leaves.map((l) => (
                  <tr key={l.id}>
                    <td>{new Date(l.applied_at).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-info">{l.leave_type}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {l.start_date} to {l.end_date}
                    </td>
                    <td>{l.days_count} Day{l.days_count > 1 ? 's' : ''}</td>
                    <td style={{ maxWidth: '220px', whiteSpace: 'normal', fontStyle: 'italic', fontSize: '0.85rem' }}>
                      "{l.reason}"
                    </td>
                    <td>
                      <span className={`badge ${
                        l.status === 'Approved' ? 'badge-success' : l.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {l.review_notes || '--'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    You haven't submitted any leave applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsApplyModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleApplySubmit}>Submit Request</button>
          </>
        }
      >
        <form onSubmit={handleApplySubmit}>
          <div className="form-group">
            <label>Leave Category</label>
            <select
              className="form-control"
              value={formData.leave_type}
              onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
            >
              <option value="Paid Leave">Paid Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reason for Leave</label>
            <textarea
              className="form-control"
              rows="3"
              required
              placeholder="State the reason for taking leave..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
}

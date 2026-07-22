import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { CheckCircle2, XCircle, Clock, CalendarDays, MessageSquare } from 'lucide-react';

export default function HRLeaves() {
  const { showToast } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('');

  // Review Modal
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewAction, setReviewAction] = useState('Approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.getAllLeaves({ status: statusTab });
      const leaveList = Array.isArray(res) ? res : (res?.leaves || []);
      setLeaves(leaveList);
    } catch (err) {
      showToast('Failed to fetch leave requests', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusTab]);

  const handleOpenReview = (leave, action) => {
    setSelectedLeave(leave);
    setReviewAction(action);
    setReviewNotes('');
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    try {
      await api.reviewLeave(selectedLeave.id, {
        status: reviewAction,
        review_notes: reviewNotes
      });
      showToast(`Leave request ${reviewAction.toLowerCase()} successfully!`, 'success');
      setIsModalOpen(false);
      fetchLeaves();
    } catch (err) {
      showToast(err.message || 'Failed to update leave status', 'danger');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Status Tabs Bar */}
      <div className="glass-card" style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 1rem' }}>
        {[
          { id: '', label: 'All Applications' },
          { id: 'Pending', label: 'Pending Review' },
          { id: 'Approved', label: 'Approved' },
          { id: 'Rejected', label: 'Rejected' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: statusTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
              background: statusTab === tab.id ? 'var(--accent-gradient)' : 'transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaves Queue List */}
      <div className="glass-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Applied Date</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Review Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading leave queue...</td>
                </tr>
              ) : leaves.length > 0 ? (
                leaves.map((l) => (
                  <tr key={l.id}>
                    <td>{new Date(l.applied_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{l.employee_name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.employee_code}</span>
                      </div>
                    </td>
                    <td>{l.department}</td>
                    <td>
                      <span className="badge badge-info">{l.leave_type}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{l.days_count} Day{l.days_count > 1 ? 's' : ''}</span>
                        <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                          {l.start_date} to {l.end_date}
                        </span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'normal', fontStyle: 'italic', fontSize: '0.85rem' }}>
                      "{l.reason}"
                    </td>
                    <td>
                      <span className={`badge ${
                        l.status === 'Approved' ? 'badge-success' : l.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {l.status === 'Pending' ? (
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleOpenReview(l, 'Approved')}
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenReview(l, 'Rejected')}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {l.review_notes ? `Notes: ${l.review_notes}` : 'Completed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No leave requests found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${reviewAction} Leave Request`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button
              className={`btn ${reviewAction === 'Approved' ? 'btn-success' : 'btn-danger'}`}
              onClick={handleReviewSubmit}
            >
              Confirm {reviewAction}
            </button>
          </>
        }
      >
        {selectedLeave && (
          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedLeave.employee_name} ({selectedLeave.leave_type})</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {selectedLeave.start_date} to {selectedLeave.end_date} ({selectedLeave.days_count} days)
              </p>
            </div>

            <div className="form-group">
              <label>Manager / HR Notes (Optional)</label>
              <textarea
                className="form-control"
                rows="3"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter feedback or explanation for the employee..."
              ></textarea>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar } from 'lucide-react';

export default function EmployeeAttendance() {
  const { showToast } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.getMyAttendanceHistory();
        setHistory(res.attendance);
      } catch (err) {
        showToast('Failed to fetch attendance history', 'danger');
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="var(--accent-primary)" /> My Attendance Logs
        </h3>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In Time</th>
                <th>Check Out Time</th>
                <th>Total Work Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading personal attendance records...</td>
                </tr>
              ) : history.length > 0 ? (
                history.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 600 }}>{row.date}</td>
                    <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                      {row.check_in || '--:--'}
                    </td>
                    <td style={{ color: row.check_out ? 'var(--color-info)' : 'var(--text-muted)' }}>
                      {row.check_out || 'In Progress'}
                    </td>
                    <td>{row.total_hours ? `${row.total_hours} hrs` : '--'}</td>
                    <td>
                      <span className={`badge ${
                        row.status === 'Present' ? 'badge-success' : row.status === 'On Leave' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No personal attendance logs found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

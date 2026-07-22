import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Filter, Clock, UserCheck } from 'lucide-react';

export default function HRAttendance() {
  const { showToast } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const empRes = await api.getEmployees({ limit: 100 });
        setEmployees(empRes.employees);
      } catch (err) {
        console.error('Failed to load employee list for filter');
      }
    }
    loadFilterOptions();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.getAllAttendance({
        employee_id: selectedEmployee,
        date: selectedDate
      });
      setAttendance(res.attendance);
    } catch (err) {
      showToast('Failed to fetch attendance logs', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedEmployee, selectedDate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filter Bar */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
          <UserCheck size={18} color="var(--text-muted)" />
          <select
            className="form-control"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employee_code})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '200px' }}>
          <Calendar size={18} color="var(--text-muted)" />
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {(selectedEmployee || selectedDate) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setSelectedEmployee(''); setSelectedDate(''); }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Attendance Table */}
      <div className="glass-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading attendance records...</td>
                </tr>
              ) : attendance.length > 0 ? (
                attendance.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 600 }}>{row.date}</td>
                    <td>
                      <span style={{ fontFamily: 'monospace', background: 'var(--bg-input)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                        {row.employee_code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{row.employee_name}</td>
                    <td>{row.department}</td>
                    <td>
                      <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                        {row.check_in || '--:--'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: row.check_out ? 'var(--color-info)' : 'var(--text-muted)', fontWeight: 500 }}>
                        {row.check_out || 'In Progress'}
                      </span>
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
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No attendance records found matching the filters.
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

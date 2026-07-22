const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('hrms_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Server returned status ${response.status}`);
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or unauthorized
        localStorage.removeItem('hrms_token');
        localStorage.removeItem('hrms_user');
      }
      throw new Error(data.message || 'API Request Failed');
    }

    return data;
  } catch (error) {
    throw error;
  }

}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),
  changePassword: (data) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),

  // HR Dashboard
  getHRDashboard: () => request('/dashboard/hr'),

  // Employee Dashboard
  getEmployeeDashboard: () => request('/dashboard/employee'),

  // Employee Management (HR)
  getEmployees: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/employees${query ? `?${query}` : ''}`);
  },
  getEmployeeById: (id) => request(`/employees/${id}`),
  createEmployee: (data) => request('/employees', { method: 'POST', body: JSON.stringify(data) }),
  bulkCreateEmployees: (data) => request('/employees/bulk', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id, data) => request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateSelfProfile: (data) => request('/employees/profile/me', { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: 'DELETE' }),

  // Attendance
  checkIn: () => request('/attendance/check-in', { method: 'POST' }),
  checkOut: () => request('/attendance/check-out', { method: 'POST' }),
  getTodayAttendance: () => request('/attendance/today'),
  getMyAttendanceHistory: () => request('/attendance/my-history'),
  getAllAttendance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/attendance/all${query ? `?${query}` : ''}`);
  },

  // Leave Management
  applyLeave: (data) => request('/leaves/apply', { method: 'POST', body: JSON.stringify(data) }),
  getMyLeaves: () => request('/leaves/my-leaves'),
  getAllLeaves: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/leaves/all${query ? `?${query}` : ''}`);
  },
  reviewLeave: (id, data) => request(`/leaves/${id}/review`, { method: 'PUT', body: JSON.stringify(data) })
};

export default api;


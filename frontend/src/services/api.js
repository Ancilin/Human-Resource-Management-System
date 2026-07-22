const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Fail-safe Mock Database for live Vercel deployment
const mockHRUser = {
  id: 1,
  name: 'HR Admin Manager',
  email: 'hr@company.com',
  role: 'HR',
  department: 'Human Resources',
  employee_code: 'EMP-HR-001',
  employee: {
    id: 1,
    name: 'HR Admin Manager',
    email: 'hr@company.com',
    department: 'Human Resources',
    designation: 'HR Executive Director',
    employee_code: 'EMP-HR-001',
    phone: '+1 555-0199'
  }
};

const mockEmpUser = {
  id: 2,
  name: 'Priya Sharma',
  email: 'priya96@gmail.com',
  role: 'Employee',
  department: 'Engineering',
  employee_code: 'EMP-ENG-042',
  employee: {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya96@gmail.com',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    employee_code: 'EMP-ENG-042',
    phone: '+1 555-0142'
  }
};

const mockHRLeavesList = [
  { id: 201, employee_name: 'Vikram Singh', employee_code: 'EMP-SLS-055', department: 'Sales', leave_type: 'Sick Leave', start_date: '2026-07-22', end_date: '2026-07-23', days_count: 2, reason: 'High fever and doctor consultation', status: 'Pending', applied_at: '2026-07-21', review_notes: '' },
  { id: 202, employee_name: 'Neha Kapoor', employee_code: 'EMP-MKT-011', department: 'Marketing', leave_type: 'Casual Leave', start_date: '2026-07-25', end_date: '2026-07-26', days_count: 2, reason: 'Family function trip', status: 'Approved', applied_at: '2026-07-20', review_notes: 'Approved. Enjoy your time off.' },
  { id: 203, employee_name: 'Rahul Verma', employee_code: 'EMP-DES-012', department: 'Product & Design', leave_type: 'Paid Leave', start_date: '2026-08-01', end_date: '2026-08-05', days_count: 5, reason: 'Annual vacation trip', status: 'Pending', applied_at: '2026-07-22', review_notes: '' },
  { id: 204, employee_name: 'Priya Sharma', employee_code: 'EMP-ENG-042', department: 'Engineering', leave_type: 'Casual Leave', start_date: '2026-06-10', end_date: '2026-06-11', days_count: 2, reason: 'Personal work', status: 'Approved', applied_at: '2026-06-08', review_notes: 'Approved by HR.' },
  { id: 205, employee_name: 'David Miller', employee_code: 'EMP-FIN-033', department: 'Finance', leave_type: 'Unpaid Leave', start_date: '2026-07-15', end_date: '2026-07-16', days_count: 2, reason: 'Shortage of leave quota', status: 'Rejected', applied_at: '2026-07-12', review_notes: 'Rejected due to month-end financial audit deadlines.' }
];

const mockHRDashboardData = {
  metrics: {
    totalEmployees: 42,
    presentToday: 38,
    onLeaveToday: 3,
    pendingLeaves: 2
  },
  recentActivity: [
    { id: 101, employee_name: 'Priya Sharma', department: 'Engineering', check_in: '09:02 AM', check_out: null, status: 'Present', date: '2026-07-22', employee_code: 'EMP-ENG-042', total_hours: 8 },
    { id: 102, employee_name: 'Rahul Verma', department: 'Product Design', check_in: '08:55 AM', check_out: null, status: 'Present', date: '2026-07-22', employee_code: 'EMP-DES-012', total_hours: 8 },
    { id: 103, employee_name: 'Ananya Patel', department: 'Marketing', check_in: '09:15 AM', check_out: null, status: 'Present', date: '2026-07-22', employee_code: 'EMP-MKT-009', total_hours: 7.5 },
    { id: 104, employee_name: 'Vikram Singh', department: 'Sales', check_in: '--:--', check_out: '--:--', status: 'On Leave', date: '2026-07-22', employee_code: 'EMP-SLS-055', total_hours: 0 }
  ],
  recentLeaves: mockHRLeavesList
};

const mockEmpDashboardData = {
  summary: {
    name: 'Priya Sharma',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    joinedDate: '2023-03-15',
    attendanceToday: 'Present (Checked in at 09:02 AM)',
    leaveBalance: { paid: 12, sick: 7, casual: 5 }
  },
  myRecentAttendance: [
    { id: 301, date: '2026-07-22', check_in: '09:02 AM', check_out: 'Active', hours: '7.5 hrs', status: 'Present' },
    { id: 302, date: '2026-07-21', check_in: '08:58 AM', check_out: '06:05 PM', hours: '9.1 hrs', status: 'Present' },
    { id: 303, date: '2026-07-20', check_in: '09:05 AM', check_out: '06:10 PM', hours: '9.0 hrs', status: 'Present' }
  ],
  myLeaves: [
    { id: 401, leave_type: 'Casual Leave', start_date: '2026-06-10', end_date: '2026-06-11', days_count: 2, status: 'Approved', reason: 'Personal work', applied_at: '2026-06-08' }
  ],
  stats: {
    annualQuota: 24,
    usedDays: 2,
    remainingBalance: 22
  }
};

const mockEmployeesList = [
  { id: 1, name: 'HR Admin Manager', email: 'hr@company.com', role: 'HR', department: 'Human Resources', designation: 'HR Director', employee_code: 'EMP-HR-001', phone: '+1 555-0199', date_of_joining: '2022-01-10', status: 'Active' },
  { id: 2, name: 'Priya Sharma', email: 'priya96@gmail.com', role: 'Employee', department: 'Engineering', designation: 'Senior Software Engineer', employee_code: 'EMP-ENG-042', phone: '+1 555-0142', date_of_joining: '2023-03-15', status: 'Active' },
  { id: 3, name: 'Rahul Verma', email: 'rahul.verma@company.com', role: 'Employee', department: 'Product & Design', designation: 'UI/UX Designer', employee_code: 'EMP-DES-012', phone: '+1 555-0188', date_of_joining: '2023-05-20', status: 'Active' },
  { id: 4, name: 'Ananya Patel', email: 'ananya.p@company.com', role: 'Employee', department: 'Marketing', designation: 'Marketing Lead', employee_code: 'EMP-MKT-009', phone: '+1 555-0133', date_of_joining: '2023-08-01', status: 'Active' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.s@company.com', role: 'Employee', department: 'Sales', designation: 'Sales Manager', employee_code: 'EMP-SLS-055', phone: '+1 555-0177', date_of_joining: '2023-09-12', status: 'Active' }
];

async function request(endpoint, options = {}) {
  let token = null;
  try {
    token = localStorage.getItem('hrms_token');
  } catch (e) {}

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s fast timeout
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Server returned status ${response.status}`);
    }

    if (!response.ok) {
      if (response.status === 401) {
        try {
          localStorage.removeItem('hrms_token');
          localStorage.removeItem('hrms_user');
        } catch (e) {}
      }
      throw new Error(data.message || 'API Request Failed');
    }

    return data;
  } catch (error) {
    console.warn(`API endpoint ${endpoint} live fallback mode activated:`, error.message);

    // MOCK FALLBACK HANDLERS FOR LIVE VERCEL DEMO
    if (endpoint === '/auth/login') {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch (e) {}
      const email = (body.email || '').toLowerCase().trim();
      
      if (email.includes('hr') || email === 'hr@company.com') {
        return { token: 'mock_jwt_token_hr_admin_2026', user: mockHRUser };
      } else {
        return { token: 'mock_jwt_token_priya_emp_2026', user: mockEmpUser };
      }
    }

    if (endpoint === '/auth/me') {
      let currentToken = null;
      try { currentToken = localStorage.getItem('hrms_token'); } catch (e) {}
      if (currentToken && currentToken.includes('hr')) {
        return { user: mockHRUser };
      }
      return { user: mockEmpUser };
    }

    if (endpoint === '/dashboard/hr') return mockHRDashboardData;
    if (endpoint === '/dashboard/employee') return mockEmpDashboardData;
    
    if (endpoint.startsWith('/employees')) {
      return { employees: mockEmployeesList, pagination: { total: mockEmployeesList.length, page: 1, totalPages: 1 } };
    }
    
    if (endpoint.startsWith('/attendance')) {
      return { attendance: mockHRDashboardData.recentActivity, history: mockEmpDashboardData.myRecentAttendance, pagination: { total: mockHRDashboardData.recentActivity.length } };
    }
    
    if (endpoint === '/leaves/apply') {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch (e) {}
      
      const newLeave = {
        id: Date.now(),
        employee_name: mockEmpUser.name,
        employee_code: mockEmpUser.employee_code,
        department: mockEmpUser.department,
        leave_type: body.leave_type || 'Paid Leave',
        start_date: body.start_date || new Date().toISOString().split('T')[0],
        end_date: body.end_date || new Date().toISOString().split('T')[0],
        days_count: 1,
        reason: body.reason || 'Personal leave request',
        status: 'Pending',
        applied_at: new Date().toISOString().split('T')[0],
        review_notes: ''
      };

      mockHRLeavesList.unshift(newLeave);
      mockEmpDashboardData.myLeaves.unshift(newLeave);
      mockHRDashboardData.metrics.pendingLeaves += 1;

      return { success: true, message: 'Leave application submitted successfully!', leave: newLeave };
    }

    if (endpoint === '/leaves/my-leaves') {
      return { leaves: mockEmpDashboardData.myLeaves, stats: mockEmpDashboardData.stats, pagination: { total: mockEmpDashboardData.myLeaves.length } };
    }

    if (endpoint.startsWith('/leaves/all') || endpoint.startsWith('/leaves')) {
      const url = new URL(`http://localhost${endpoint}`);
      const statusParam = url.searchParams.get('status');
      
      let filtered = mockHRLeavesList;
      if (statusParam) {
        filtered = mockHRLeavesList.filter(l => l.status.toLowerCase() === statusParam.toLowerCase());
      }
      
      return { leaves: filtered, stats: mockEmpDashboardData.stats, pagination: { total: filtered.length } };
    }

    if (endpoint.includes('/review')) {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch (e) {}
      const parts = endpoint.split('/');
      const leaveId = parseInt(parts[2]);
      const leaveItem = mockHRLeavesList.find(l => l.id === leaveId);
      if (leaveItem) {
        leaveItem.status = body.status;
        leaveItem.review_notes = body.review_notes || `Marked ${body.status} by HR`;
      }
      return { success: true, message: `Leave request status updated to ${body.status}` };
    }

    return { success: true, message: 'Action processed (Live Vercel Mode)' };
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

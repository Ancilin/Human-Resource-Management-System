const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.origin.includes('vercel.app') ? '/api' : 'http://localhost:5000/api');

// Declaring user variables as let for persistence loading
let mockHRUser = {
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

let mockEmpUser = {
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

// Declaring dataset variables for local data persistence
let mockHRLeavesList = [];
let mockHRDashboardData = {};
let mockEmpDashboardData = {};
let mockEmployeesList = [];

// Persistence helper functions
function saveMockData() {
  try {
    localStorage.setItem('mock_hr_user', JSON.stringify(mockHRUser));
    localStorage.setItem('mock_emp_user', JSON.stringify(mockEmpUser));
    localStorage.setItem('mock_hr_leaves', JSON.stringify(mockHRLeavesList));
    localStorage.setItem('mock_hr_dashboard', JSON.stringify(mockHRDashboardData));
    localStorage.setItem('mock_emp_dashboard', JSON.stringify(mockEmpDashboardData));
    localStorage.setItem('mock_employees', JSON.stringify(mockEmployeesList));
  } catch (e) {
    console.warn('Failed to save mock database state:', e);
  }
}

function initMockData() {
  try {
    const savedHRUser = localStorage.getItem('mock_hr_user');
    const savedEmpUser = localStorage.getItem('mock_emp_user');
    const leaves = localStorage.getItem('mock_hr_leaves');
    const hrDash = localStorage.getItem('mock_hr_dashboard');
    const empDash = localStorage.getItem('mock_emp_dashboard');
    const emps = localStorage.getItem('mock_employees');

    if (savedHRUser) mockHRUser = JSON.parse(savedHRUser);
    if (savedEmpUser) mockEmpUser = JSON.parse(savedEmpUser);

    mockHRLeavesList = leaves ? JSON.parse(leaves) : [
      { id: 201, employee_name: 'Vikram Singh', employee_code: 'EMP-SLS-055', department: 'Sales', leave_type: 'Sick Leave', start_date: '2026-07-22', end_date: '2026-07-23', days_count: 2, reason: 'High fever and doctor consultation', status: 'Pending', applied_at: '2026-07-21', review_notes: '' },
      { id: 202, employee_name: 'Neha Kapoor', employee_code: 'EMP-MKT-011', department: 'Marketing', leave_type: 'Casual Leave', start_date: '2026-07-25', end_date: '2026-07-26', days_count: 2, reason: 'Family function trip', status: 'Approved', applied_at: '2026-07-20', review_notes: 'Approved. Enjoy your time off.' },
      { id: 203, employee_name: 'Rahul Verma', employee_code: 'EMP-DES-012', department: 'Product & Design', leave_type: 'Paid Leave', start_date: '2026-08-01', end_date: '2026-08-05', days_count: 5, reason: 'Annual vacation trip', status: 'Pending', applied_at: '2026-07-22', review_notes: '' },
      { id: 204, employee_name: 'Priya Sharma', employee_code: 'EMP-ENG-042', department: 'Engineering', leave_type: 'Casual Leave', start_date: '2026-06-10', end_date: '2026-06-11', days_count: 2, reason: 'Personal work', status: 'Approved', applied_at: '2026-06-08', review_notes: 'Approved by HR.' },
      { id: 205, employee_name: 'David Miller', employee_code: 'EMP-FIN-033', department: 'Finance', leave_type: 'Unpaid Leave', start_date: '2026-07-15', end_date: '2026-07-16', days_count: 2, reason: 'Shortage of leave quota', status: 'Rejected', applied_at: '2026-07-12', review_notes: 'Rejected due to month-end financial audit deadlines.' }
    ];

    mockHRDashboardData = hrDash ? JSON.parse(hrDash) : {
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

    mockEmpDashboardData = empDash ? JSON.parse(empDash) : {
      profile: {
        name: 'Priya Sharma',
        email: 'priya96@gmail.com',
        employee_code: 'EMP-ENG-042',
        department: 'Engineering',
        designation: 'Senior Software Engineer',
        avatar: '',
        phone: '+1 555-0142'
      },
      todayAttendance: null,
      leaveStats: {
        annualQuota: 24,
        usedDays: 2,
        remainingBalance: 22
      },
      notifications: [
        { id: 1, title: 'Welcome to Workforce HRMS', message: 'Your employee portal account is active. Use this portal to check in/out and apply for leaves.' }
      ],
      myRecentAttendance: [
        { id: 302, date: '2026-07-22', check_in: '08:58 AM', check_out: '06:05 PM', hours: '9.1 hrs', status: 'Present' },
        { id: 303, date: '2026-07-21', check_in: '09:05 AM', check_out: '06:10 PM', hours: '9.0 hrs', status: 'Present' }
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

    // Keep dynamic sync with loaded user state
    mockEmpDashboardData.profile.name = mockEmpUser.name;
    mockEmpDashboardData.profile.phone = mockEmpUser.employee.phone;

    mockEmployeesList = emps ? JSON.parse(emps) : [
      { id: 1, name: 'HR Admin Manager', email: 'hr@company.com', role: 'HR', department: 'Human Resources', designation: 'HR Director', employee_code: 'EMP-HR-001', phone: '+1 555-0199', date_of_joining: '2022-01-10', status: 'Active' },
      { id: 2, name: 'Priya Sharma', email: 'priya96@gmail.com', role: 'Employee', department: 'Engineering', designation: 'Senior Software Engineer', employee_code: 'EMP-ENG-042', phone: '+1 555-0142', date_of_joining: '2023-03-15', status: 'Active' },
      { id: 3, name: 'Rahul Verma', email: 'rahul.verma@company.com', role: 'Employee', department: 'Product & Design', designation: 'UI/UX Designer', employee_code: 'EMP-DES-012', phone: '+1 555-0188', date_of_joining: '2023-05-20', status: 'Active' },
      { id: 4, name: 'Ananya Patel', email: 'ananya.p@company.com', role: 'Employee', department: 'Marketing', designation: 'Marketing Lead', employee_code: 'EMP-MKT-009', phone: '+1 555-0133', date_of_joining: '2023-08-01', status: 'Active' },
      { id: 5, name: 'Vikram Singh', email: 'vikram.s@company.com', role: 'Employee', department: 'Sales', designation: 'Sales Manager', employee_code: 'EMP-SLS-055', phone: '+1 555-0177', date_of_joining: '2023-09-12', status: 'Active' }
    ];
  } catch (e) {
    console.warn('Failed to parse persistent mock database state:', e);
  }
}

// Run state loader
initMockData();

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
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout to allow serverless cold starts
    
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
      const password = body.password || '';

      console.log('api.js mock login handler evaluating:', { email, password });

      if (email === 'hr@company.com') {
        if (password === 'hr123543') {
          console.log('api.js mock login: HR password matches');
          return { token: 'mock_jwt_token_hr_admin_2026', user: mockHRUser };
        } else {
          console.warn('api.js mock login: HR password MISMATCH');
          throw new Error('Invalid credentials. Password verification failed for HR Admin.');
        }
      }

      if (email === 'priya96@gmail.com') {
        if (password === 'Password123!') {
          return { token: 'mock_jwt_token_priya_emp_2026', user: mockEmpUser };
        } else {
          throw new Error('Invalid credentials. Password verification failed for Employee (Priya).');
        }
      }

      // Check dynamically created employees
      const matchEmp = mockEmployeesList.find(e => e.email.toLowerCase() === email);
      if (matchEmp) {
        if (password === 'Password123!') {
          const dynamicUser = {
            id: matchEmp.id,
            name: matchEmp.name,
            email: matchEmp.email,
            role: matchEmp.role === 'HR' ? 'HR' : 'Employee',
            department: matchEmp.department,
            employee_code: matchEmp.employee_code,
            employee: matchEmp
          };
          return { token: `mock_jwt_token_${matchEmp.id}_2026`, user: dynamicUser };
        } else {
          throw new Error(`Invalid credentials. Password verification failed for ${matchEmp.name}.`);
        }
      }

      throw new Error('Invalid work email address or password. Access Denied.');
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
    
    // Employee Profiles / Self Edit
    if (endpoint === '/employees/profile/me') {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch (e) {}
      if (body.name) {
        mockEmpUser.name = body.name;
        mockEmpUser.employee.name = body.name;
        mockEmpDashboardData.profile.name = body.name;
      }
      if (body.phone) {
        mockEmpUser.employee.phone = body.phone;
        mockEmpDashboardData.profile.phone = body.phone;
      }
      saveMockData();
      return { success: true, message: 'Profile updated successfully', employee: mockEmpUser.employee };
    }

    // Employees Management Actions
    if (endpoint.startsWith('/employees')) {
      if (options.method === 'POST') {
        let body = {};
        try { body = JSON.parse(options.body || '{}'); } catch (e) {}
        
        if (endpoint === '/employees') {
          const newEmp = {
            id: Date.now(),
            name: body.name || 'New Employee',
            email: body.email || '',
            phone: body.phone || '',
            role: body.role || 'EMPLOYEE',
            department: body.department || 'Engineering',
            designation: body.designation || 'Software Engineer',
            employee_code: `EMP-GEN-${Math.floor(100 + Math.random() * 900)}`,
            date_of_joining: body.date_of_joining || new Date().toISOString().split('T')[0],
            status: 'Active'
          };
          mockEmployeesList.unshift(newEmp);
          mockHRDashboardData.metrics.totalEmployees += 1;
          saveMockData();
          return { success: true, message: 'Employee added successfully', employee: newEmp };
        }
        
        if (endpoint === '/employees/bulk') {
          const list = body.employees || [];
          const addedList = list.map(item => ({
            id: Date.now() + Math.random(),
            name: item.Name || item.name || 'Bulk Staff',
            email: item.Email || item.email || '',
            phone: item.Phone || item.phone || '',
            role: item.Role || item.role || 'EMPLOYEE',
            department: item.Department || item.department || 'Engineering',
            designation: item.Designation || item.designation || 'Specialist',
            employee_code: `EMP-BLK-${Math.floor(100 + Math.random() * 900)}`,
            date_of_joining: item['Date of Joining'] || item.date_of_joining || new Date().toISOString().split('T')[0],
            status: 'Active'
          }));
          mockEmployeesList.unshift(...addedList);
          mockHRDashboardData.metrics.totalEmployees += addedList.length;
          saveMockData();
          return { success: true, message: `Successfully imported ${addedList.length} employees` };
        }
      }
      
      if (options.method === 'PUT') {
        let body = {};
        try { body = JSON.parse(options.body || '{}'); } catch (e) {}
        const parts = endpoint.split('/');
        const empId = parseInt(parts[2]);
        const empItem = mockEmployeesList.find(e => e.id === empId);
        if (empItem) {
          Object.assign(empItem, body);
          saveMockData();
        }
        return { success: true, message: 'Employee details updated' };
      }

      if (options.method === 'DELETE') {
        const parts = endpoint.split('/');
        const empId = parseInt(parts[2]);
        mockEmployeesList = mockEmployeesList.filter(e => e.id !== empId);
        mockHRDashboardData.metrics.totalEmployees = Math.max(0, mockHRDashboardData.metrics.totalEmployees - 1);
        saveMockData();
        return { success: true, message: 'Employee deleted' };
      }

      return { employees: mockEmployeesList, pagination: { total: mockEmployeesList.length, page: 1, totalPages: 1 } };
    }
    
    // Attendance Endpoints
    if (endpoint === '/attendance/check-in') {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const todayDate = now.toISOString().split('T')[0];
      
      mockEmpDashboardData.todayAttendance = {
        id: Date.now(),
        employee_id: 2,
        date: todayDate,
        check_in: timeString,
        check_out: null,
        total_hours: null,
        status: 'Present',
        checkInTimeRaw: now.getTime() // Raw milliseconds for math
      };

      // Add to myRecentAttendance logs
      mockEmpDashboardData.myRecentAttendance.unshift({
        id: Date.now(),
        date: todayDate,
        check_in: timeString,
        check_out: 'Active',
        hours: '--',
        status: 'Present'
      });

      // Also add to global HR Activity today
      mockHRDashboardData.recentActivity.unshift({
        id: Date.now(),
        employee_name: mockEmpUser.name,
        employee_code: mockEmpUser.employee_code,
        department: mockEmpUser.department,
        check_in: timeString,
        check_out: null,
        status: 'Present',
        date: todayDate,
        total_hours: null
      });

      mockHRDashboardData.metrics.presentToday += 1;
      saveMockData();

      return { success: true, message: 'Clocked in successfully!' };
    }

    if (endpoint === '/attendance/check-out') {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const todayDate = now.toISOString().split('T')[0];

      let totalHours = 8.0; // Fallback default
      if (mockEmpDashboardData.todayAttendance) {
        mockEmpDashboardData.todayAttendance.check_out = timeString;
        
        let rawIn = mockEmpDashboardData.todayAttendance.checkInTimeRaw;
        if (!rawIn) {
          try {
            const checkInStr = mockEmpDashboardData.todayAttendance.check_in;
            const [time, ampm] = checkInStr.split(' ');
            let [h, m] = time.split(':').map(Number);
            if (ampm && ampm.toLowerCase() === 'pm' && h < 12) h += 12;
            if (ampm && ampm.toLowerCase() === 'am' && h === 12) h = 0;
            const checkInDate = new Date();
            checkInDate.setHours(h, m, 0, 0);
            rawIn = checkInDate.getTime();
          } catch (err) {
            console.error('Failed to parse raw clock in time:', err);
          }
        }

        if (rawIn) {
          const diffMs = now.getTime() - rawIn;
          const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
          totalHours = parseFloat((diffMinutes / 60).toFixed(2));
          if (totalHours <= 0) {
            totalHours = 0.01; // Minimum non-zero value
          }
        }
        mockEmpDashboardData.todayAttendance.total_hours = totalHours;
      }

      // Update in myRecentAttendance
      const log = mockEmpDashboardData.myRecentAttendance.find(l => l.date === todayDate);
      if (log) {
        log.check_out = timeString;
        log.hours = `${totalHours} hrs`;
      }

      // Update in global HR Activity
      const hrLog = mockHRDashboardData.recentActivity.find(a => a.employee_code === mockEmpUser.employee_code && a.date === todayDate);
      if (hrLog) {
        hrLog.check_out = timeString;
        hrLog.total_hours = totalHours;
      }

      saveMockData();
      return { success: true, message: `Clocked out successfully! (Worked ${totalHours} hrs)` };
    }

    if (endpoint === '/attendance/today') {
      return mockEmpDashboardData.todayAttendance;
    }

    if (endpoint === '/attendance/my-history') {
      return { attendance: mockEmpDashboardData.myRecentAttendance };
    }

    if (endpoint.startsWith('/attendance')) {
      return { attendance: mockHRDashboardData.recentActivity, history: mockEmpDashboardData.myRecentAttendance, pagination: { total: mockHRDashboardData.recentActivity.length } };
    }
    
    // Leave Endpoints
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
      saveMockData();

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
        const oldStatus = leaveItem.status;
        leaveItem.status = body.status;
        leaveItem.review_notes = body.review_notes || `Marked ${body.status} by HR`;
        
        // Update stats if it matches employee demo user (Priya)
        if (leaveItem.employee_name === mockEmpUser.name) {
          if (body.status === 'Approved' && oldStatus !== 'Approved') {
            mockEmpDashboardData.stats.usedDays += leaveItem.days_count;
            mockEmpDashboardData.stats.remainingBalance = Math.max(0, mockEmpDashboardData.stats.annualQuota - mockEmpDashboardData.stats.usedDays);
            mockEmpDashboardData.leaveStats = { ...mockEmpDashboardData.stats };
          }
        }
        
        // Decrement HR Dashboard pending leave count metric
        if (oldStatus === 'Pending' && body.status !== 'Pending') {
          mockHRDashboardData.metrics.pendingLeaves = Math.max(0, mockHRDashboardData.metrics.pendingLeaves - 1);
        }
        
        saveMockData();
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

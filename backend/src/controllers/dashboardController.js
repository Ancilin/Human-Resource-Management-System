import db from '../config/db.js';

export async function getHRDashboard(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Total active employees (excluding HR/Admin)
    const { totalEmployees } = await db.get(
      `SELECT COUNT(*) as totalEmployees FROM employees e JOIN users u ON e.user_id = u.id WHERE e.status = 'Active' AND u.role = 'EMPLOYEE'`
    );

    // 2. Present today count
    const { presentToday } = await db.get(
      `SELECT COUNT(*) as presentToday FROM attendance WHERE date = ? AND (status = 'Present' OR status = 'Half Day')`,
      [today]
    );

    // 3. On leave today count
    const { onLeaveToday } = await db.get(
      `SELECT COUNT(*) as onLeaveToday FROM attendance WHERE date = ? AND status = 'On Leave'`,
      [today]
    );

    // 4. Pending leaves count
    const { pendingLeaves } = await db.get(`SELECT COUNT(*) as pendingLeaves FROM leaves WHERE status = 'Pending'`);

    // 5. Recent Attendance Logs
    const recentActivity = await db.all(`
      SELECT a.*, e.name as employee_name, e.employee_code, e.department, e.avatar
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      ORDER BY a.id DESC
      LIMIT 6
    `);

    // 6. Recent Leave Requests
    const recentLeaves = await db.all(`
      SELECT l.*, e.name as employee_name, e.department
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      WHERE l.status = 'Pending'
      ORDER BY l.id DESC
      LIMIT 5
    `);

    return res.json({
      success: true,
      metrics: {
        totalEmployees,
        presentToday,
        onLeaveToday,
        pendingLeaves
      },
      recentActivity,
      recentLeaves
    });
  } catch (error) {
    console.error('HR dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch HR dashboard metrics.' });
  }
}

export async function getEmployeeDashboard(req, res) {
  try {
    const employeeId = req.user.employee_id;
    const userId = req.user.user_id;
    const today = new Date().toISOString().split('T')[0];

    // Today's attendance
    const todayAttendance = await db.get(
      `SELECT * FROM attendance WHERE employee_id = ? AND date = ?`,
      [employeeId, today]
    );

    // Leave stats
    const approvedLeaves = await db.all(
      `SELECT days_count FROM leaves WHERE employee_id = ? AND status = 'Approved'`,
      [employeeId]
    );
    const usedDays = approvedLeaves.reduce((acc, l) => acc + l.days_count, 0);

    // Recent notifications
    const notifications = await db.all(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 5`,
      [userId]
    );

    return res.json({
      success: true,
      profile: {
        name: req.user.name,
        email: req.user.email,
        employee_code: req.user.employee_code,
        department: req.user.department,
        designation: req.user.designation,
        avatar: req.user.avatar
      },
      todayAttendance: todayAttendance || null,
      leaveStats: {
        annualQuota: 24,
        usedDays,
        remainingBalance: Math.max(0, 24 - usedDays)
      },
      notifications
    });
  } catch (error) {
    console.error('Employee dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch employee dashboard data.' });
  }
}

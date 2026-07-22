import db from '../config/db.js';

export async function applyLeave(req, res) {
  try {
    const employeeId = req.user.employee_id;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'No employee profile attached.' });
    }

    const { leave_type, start_date, end_date, reason } = req.body;

    if (!leave_type || !start_date || !end_date || !reason) {
      return res.status(400).json({ success: false, message: 'Please fill in all required leave details.' });
    }

    // Calculate days count
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date cannot be prior to start date.' });
    }

    const diffTime = Math.abs(end - start);
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const result = await db.run(
      `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [employeeId, leave_type, start_date, end_date, daysCount, reason]
    );

    const newLeave = await db.get(`SELECT * FROM leaves WHERE id = ?`, [result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      leave: newLeave
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit leave request.' });
  }
}

export async function getMyLeaves(req, res) {
  try {
    const employeeId = req.user.employee_id;
    const leaves = await db.all(
      `SELECT * FROM leaves WHERE employee_id = ? ORDER BY id DESC`,
      [employeeId]
    );

    // Calculate leave balance metrics
    const totalApprovedDays = leaves
      .filter(l => l.status === 'Approved')
      .reduce((acc, l) => acc + l.days_count, 0);

    const annualQuota = 24;
    const remainingBalance = Math.max(0, annualQuota - totalApprovedDays);

    return res.json({
      success: true,
      leaves,
      stats: {
        annualQuota,
        usedDays: totalApprovedDays,
        remainingBalance,
        pendingRequests: leaves.filter(l => l.status === 'Pending').length
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch personal leave requests.' });
  }
}

export async function getAllLeaves(req, res) {
  try {
    const { status = '' } = req.query;

    let query = `
      SELECT l.*, e.name as employee_name, e.employee_code, e.department, e.designation
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND l.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY CASE WHEN l.status = 'Pending' THEN 1 ELSE 2 END, l.id DESC`;

    const leaves = await db.all(query, params);

    return res.json({
      success: true,
      leaves
    });
  } catch (error) {
    console.error('Fetch all leaves error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch leave applications.' });
  }
}

export async function reviewLeave(req, res) {
  try {
    const { id } = req.params;
    const { status, review_notes = '' } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be Approved or Rejected.' });
    }

    const leave = await db.get(`SELECT l.*, e.user_id FROM leaves l JOIN employees e ON l.employee_id = e.id WHERE l.id = ?`, [id]);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave application not found.' });
    }

    await db.run(
      `UPDATE leaves SET status = ?, review_notes = ? WHERE id = ?`,
      [status, review_notes, id]
    );

    // If approved, update attendance status if leave encompasses today or current dates
    if (status === 'Approved') {
      const today = new Date().toISOString().split('T')[0];
      if (today >= leave.start_date && today <= leave.end_date) {
        await db.run(
          `INSERT OR REPLACE INTO attendance (employee_id, date, status, notes)
           VALUES (?, ?, 'On Leave', ?)`,
          [leave.employee_id, today, `Approved Leave: ${leave.leave_type}`]
        );
      }
    }

    // Send notification to employee
    await db.run(
      `INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)`,
      [
        leave.user_id,
        `Leave Request ${status}`,
        `Your ${leave.leave_type} from ${leave.start_date} to ${leave.end_date} has been ${status.toLowerCase()}.${review_notes ? ' Notes: ' + review_notes : ''}`
      ]
    );

    const updatedLeave = await db.get(`SELECT * FROM leaves WHERE id = ?`, [id]);

    return res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully.`,
      leave: updatedLeave
    });
  } catch (error) {
    console.error('Review leave error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update leave status.' });
  }
}

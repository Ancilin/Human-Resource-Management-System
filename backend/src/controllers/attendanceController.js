import db from '../config/db.js';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function getTimeString() {
  return new Date().toTimeString().split(' ')[0];
}

export async function checkIn(req, res) {
  try {
    const employeeId = req.user.employee_id;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'No employee record linked to user.' });
    }

    const today = getTodayString();
    const nowTime = getTimeString();

    const existing = await db.get(
      `SELECT * FROM attendance WHERE employee_id = ? AND date = ?`,
      [employeeId, today]
    );

    if (existing && existing.check_in) {
      return res.status(400).json({
        success: false,
        message: `You have already checked in today at ${existing.check_in}`
      });
    }

    if (existing) {
      await db.run(
        `UPDATE attendance SET check_in = ?, status = 'Present' WHERE id = ?`,
        [nowTime, existing.id]
      );
    } else {
      await db.run(
        `INSERT INTO attendance (employee_id, date, check_in, status) VALUES (?, ?, ?, 'Present')`,
        [employeeId, today, nowTime]
      );
    }

    const record = await db.get(
      `SELECT * FROM attendance WHERE employee_id = ? AND date = ?`,
      [employeeId, today]
    );

    return res.json({
      success: true,
      message: `Checked in successfully at ${nowTime}`,
      attendance: record
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record check-in.' });
  }
}

export async function checkOut(req, res) {
  try {
    const employeeId = req.user.employee_id;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'No employee record linked to user.' });
    }

    const today = getTodayString();
    const nowTime = getTimeString();

    const existing = await db.get(
      `SELECT * FROM attendance WHERE employee_id = ? AND date = ?`,
      [employeeId, today]
    );

    if (!existing || !existing.check_in) {
      return res.status(400).json({ success: false, message: 'You must check in first before checking out.' });
    }

    if (existing.check_out) {
      return res.status(400).json({ success: false, message: `Already checked out today at ${existing.check_out}` });
    }

    // Calculate total hours
    const checkInParts = existing.check_in.split(':');
    const checkOutParts = nowTime.split(':');
    
    const checkInMinutes = parseInt(checkInParts[0]) * 60 + parseInt(checkInParts[1]);
    const checkOutMinutes = parseInt(checkOutParts[0]) * 60 + parseInt(checkOutParts[1]);
    const diffMinutes = Math.max(0, checkOutMinutes - checkInMinutes);
    const totalHours = parseFloat((diffMinutes / 60).toFixed(2));

    let status = 'Present';
    if (totalHours < 4 && totalHours > 0) {
      status = 'Half Day';
    }

    await db.run(
      `UPDATE attendance SET check_out = ?, total_hours = ?, status = ? WHERE id = ?`,
      [nowTime, totalHours, status, existing.id]
    );

    const record = await db.get(
      `SELECT * FROM attendance WHERE employee_id = ? AND date = ?`,
      [employeeId, today]
    );

    return res.json({
      success: true,
      message: `Checked out successfully at ${nowTime}. Total hours: ${totalHours} hrs`,
      attendance: record
    });
  } catch (error) {
    console.error('Check-out error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record check-out.' });
  }
}

export async function getTodayStatus(req, res) {
  try {
    const employeeId = req.user.employee_id;
    const today = getTodayString();

    const record = await db.get(
      `SELECT * FROM attendance WHERE employee_id = ? AND date = ?`,
      [employeeId, today]
    );

    return res.json({
      success: true,
      today,
      attendance: record || null
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch today status.' });
  }
}

export async function getMyAttendanceHistory(req, res) {
  try {
    const employeeId = req.user.employee_id;
    const records = await db.all(
      `SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC LIMIT 100`,
      [employeeId]
    );

    return res.json({
      success: true,
      attendance: records
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch attendance history.' });
  }
}

export async function getAllAttendance(req, res) {
  try {
    const { employee_id, date, start_date, end_date } = req.query;

    let query = `
      SELECT a.*, e.name as employee_name, e.employee_code, e.department, e.designation
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (employee_id) {
      query += ` AND a.employee_id = ?`;
      params.push(employee_id);
    }

    if (date) {
      query += ` AND a.date = ?`;
      params.push(date);
    } else {
      if (start_date) {
        query += ` AND a.date >= ?`;
        params.push(start_date);
      }
      if (end_date) {
        query += ` AND a.date <= ?`;
        params.push(end_date);
      }
    }

    query += ` ORDER BY a.date DESC, a.check_in DESC LIMIT 200`;

    const records = await db.all(query, params);

    return res.json({
      success: true,
      attendance: records
    });
  } catch (error) {
    console.error('Fetch all attendance error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch attendance records.' });
  }
}

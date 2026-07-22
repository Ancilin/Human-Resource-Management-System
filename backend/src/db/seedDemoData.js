import db from '../config/db.js';

export async function populateTodayDemoData() {
  console.log('Populating Attendance & Leave records for Today...');
  const today = '2026-07-22';
  const yesterday = '2026-07-21';

  // Fetch all non-HR employees
  const employees = await db.all(`
    SELECT e.id, e.name, e.department, e.employee_code
    FROM employees e
    JOIN users u ON e.user_id = u.id
    WHERE u.role = 'EMPLOYEE'
  `);

  console.log(`Found ${employees.length} employees to allocate data for.`);

  // 1. Clear existing attendance and leaves to avoid duplicate constraint errors
  await db.run(`DELETE FROM attendance WHERE date = ?`, [today]);
  await db.run(`DELETE FROM attendance WHERE date = ?`, [yesterday]);

  // 2. Allocate Attendance & Leaves
  const leaveReasons = [
    'Heavy Head Pain & Fever - Doctor advised rest',
    'Attending family wedding ceremony',
    'Personal domestic work at home',
    'Scheduled health checkup & blood test',
    'Child school annual day event',
    'Vehicle repair and maintenance',
    'Urgent passport verification appointment'
  ];

  let leaveReqIndex = 0;

  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    const mod = i % 10;

    if (mod < 6) {
      // 60% Present (Completed Shift)
      const inMin = Math.floor(Math.random() * 45); // 08:45 to 09:30
      const inHour = 8 + (inMin > 30 ? 1 : 0);
      const checkIn = `0${inHour}:${inMin < 10 ? '0' + inMin : inMin}:15`;
      const checkOut = `17:${30 + (i % 25)}:45`;
      const totalHours = 8.5;

      await db.run(
        `INSERT INTO attendance (employee_id, date, check_in, check_out, status, total_hours)
         VALUES (?, ?, ?, ?, 'Present', ?)`,
        [emp.id, today, checkIn, checkOut, totalHours]
      );
    } else if (mod < 8) {
      // 20% Present (Currently Clocked In)
      const inMin = 10 + (i % 20);
      const checkIn = `09:${inMin < 10 ? '0' + inMin : inMin}:00`;

      await db.run(
        `INSERT INTO attendance (employee_id, date, check_in, check_out, status, total_hours)
         VALUES (?, ?, ?, NULL, 'Present', 0)`,
        [emp.id, today, checkIn]
      );
    } else if (mod === 8) {
      // 10% Half Day
      await db.run(
        `INSERT INTO attendance (employee_id, date, check_in, check_out, status, total_hours)
         VALUES (?, ?, '09:00:00', '13:00:00', 'Half Day', 4.0)`,
        [emp.id, today]
      );
    } else {
      // 10% On Leave
      await db.run(
        `INSERT INTO attendance (employee_id, date, status, notes)
         VALUES (?, ?, 'On Leave', 'Approved Annual Vacation')`,
        [emp.id, today]
      );

      // Create Approved Leave record
      const reason = leaveReasons[leaveReqIndex % leaveReasons.length];
      leaveReqIndex++;
      await db.run(
        `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status, review_notes)
         VALUES (?, 'Paid Leave', ?, ?, 1, ?, 'Approved', 'Approved by HR Director')`,
        [emp.id, today, today, reason]
      );
    }
  }

  // 3. Populate Pending & Rejected Leave Requests for HR Portal Review
  const pendingCount = Math.min(15, employees.length);
  for (let k = 0; k < pendingCount; k++) {
    const emp = employees[k * 2 % employees.length];
    const status = k % 3 === 0 ? 'Pending' : k % 3 === 1 ? 'Approved' : 'Rejected';
    const leaveType = k % 2 === 0 ? 'Sick Leave' : 'Casual Leave';
    const reason = leaveReasons[k % leaveReasons.length];
    const reviewNotes = status === 'Approved' ? 'Approved' : status === 'Rejected' ? 'High workload during current sprint - Please reschedule.' : '';

    await db.run(
      `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status, review_notes)
       VALUES (?, ?, ?, ?, 1, ?, ?, ?)`,
      [emp.id, leaveType, today, today, reason, status, reviewNotes]
    );
  }

  console.log(`Successfully generated attendance and leave data for ${today}!`);
}

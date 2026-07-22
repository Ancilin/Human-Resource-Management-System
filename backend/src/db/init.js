import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import { populateTodayDemoData } from './seedDemoData.js';

export async function initDatabase() {
  console.log('Initializing Database Tables...');


  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('HR', 'EMPLOYEE')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      employee_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      department TEXT NOT NULL,
      designation TEXT NOT NULL,
      date_of_joining DATE NOT NULL,
      avatar TEXT DEFAULT NULL,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      check_in TIME,
      check_out TIME,
      status TEXT CHECK(status IN ('Present', 'Half Day', 'Absent', 'On Leave')) DEFAULT 'Present',
      total_hours REAL DEFAULT 0,
      notes TEXT,
      UNIQUE(employee_id, date)
    );

    CREATE TABLE IF NOT EXISTS leaves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
      leave_type TEXT CHECK(leave_type IN ('Paid Leave', 'Sick Leave', 'Casual Leave', 'Unpaid Leave')) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      days_count INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT CHECK(status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      review_notes TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database tables verified.');
  await seedInitialData();
  await populateTodayDemoData();
}



async function seedInitialData() {
  console.log('Verifying HR and Employee records...');
  const hrPasswordHash = await bcrypt.hash('hr123543', 10);
  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const existingHR = await db.get(`SELECT * FROM users WHERE email = 'hr@company.com'`);
  if (existingHR) {
    // Update password for HR user to hr123543
    await db.run(`UPDATE users SET password = ? WHERE email = 'hr@company.com'`, [hrPasswordHash]);
    console.log('HR password reset/updated to: hr123543');
    return;
  }

  console.log('Seeding initial HR and Employee records...');

  // 1. Create HR User
  const hrUserRes = await db.run(
    `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
    ['hr@company.com', hrPasswordHash, 'HR']
  );
  await db.run(
    `INSERT INTO employees (user_id, employee_code, name, email, phone, department, designation, date_of_joining)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      hrUserRes.lastID,
      'EMP-HR001',
      'Sarah Jenkins',
      'hr@company.com',
      '+1 (555) 019-2834',
      'Human Resources',
      'HR Director',
      '2022-01-15'
    ]
  );

  // 2. Create Employee 1
  const emp1User = await db.run(
    `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
    ['john.doe@company.com', defaultPasswordHash, 'EMPLOYEE']
  );
  const emp1Res = await db.run(
    `INSERT INTO employees (user_id, employee_code, name, email, phone, department, designation, date_of_joining)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      emp1User.lastID,
      'EMP-1001',
      'John Doe',
      'john.doe@company.com',
      '+1 (555) 234-5678',
      'Engineering',
      'Senior Software Engineer',
      '2023-03-01'
    ]
  );

  // 3. Create Employee 2
  const emp2User = await db.run(
    `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
    ['jane.smith@company.com', defaultPasswordHash, 'EMPLOYEE']
  );
  const emp2Res = await db.run(
    `INSERT INTO employees (user_id, employee_code, name, email, phone, department, designation, date_of_joining)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      emp2User.lastID,
      'EMP-1002',
      'Jane Smith',
      'jane.smith@company.com',
      '+1 (555) 345-6789',
      'Product & Design',
      'UI/UX Designer',
      '2023-06-15'
    ]
  );

  // 4. Create Employee 3
  const emp3User = await db.run(
    `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
    ['alex.jones@company.com', defaultPasswordHash, 'EMPLOYEE']
  );
  const emp3Res = await db.run(
    `INSERT INTO employees (user_id, employee_code, name, email, phone, department, designation, date_of_joining)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      emp3User.lastID,
      'EMP-1003',
      'Alex Jones',
      'alex.jones@company.com',
      '+1 (555) 456-7890',
      'Marketing',
      'Growth Specialist',
      '2024-01-10'
    ]
  );

  // 5. Seed Attendance
  await db.run(
    `INSERT INTO attendance (employee_id, date, check_in, check_out, status, total_hours)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [emp1Res.lastID, today, '09:02:15', null, 'Present', 0]
  );
  await db.run(
    `INSERT INTO attendance (employee_id, date, check_in, check_out, status, total_hours)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [emp1Res.lastID, yesterday, '08:58:00', '17:30:00', 'Present', 8.5]
  );

  // 6. Seed Leaves
  await db.run(
    `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [emp3Res.lastID, 'Paid Leave', today, today, 1, 'Family engagement event', 'Approved']
  );

  console.log('Seeding completed successfully!');
}


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
}

async function seedInitialData() {
  console.log('Verifying HR record...');
  const hrPasswordHash = await bcrypt.hash('hr123543', 10);

  const existingHR = await db.get(`SELECT * FROM users WHERE email = 'hr@company.com'`);
  if (existingHR) {
    // Update password for HR user to hr123543
    await db.run(`UPDATE users SET password = ? WHERE email = 'hr@company.com'`, [hrPasswordHash]);
    console.log('HR password reset/updated to: hr123543');
    return;
  }

  console.log('Seeding initial HR record...');

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
  console.log('Seeding completed successfully!');
}


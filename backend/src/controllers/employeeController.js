import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export async function getAllEmployees(req, res) {
  try {
    const { search = '', department = '', status = '', page = 1, limit = 50 } = req.query;

    let query = `SELECT e.*, u.role FROM employees e JOIN users u ON e.user_id = u.id WHERE u.role = 'EMPLOYEE'`;
    const params = [];

    if (search) {
      query += ` AND (e.name LIKE ? OR e.email LIKE ? OR e.employee_code LIKE ? OR e.designation LIKE ?)`;
      const sPattern = `%${search}%`;
      params.push(sPattern, sPattern, sPattern, sPattern);
    }

    if (department) {
      query += ` AND e.department = ?`;
      params.push(department);
    }

    if (status) {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY e.id DESC`;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const employees = await db.all(query, params);
    
    // Count query for pagination meta
    let countQuery = `SELECT COUNT(*) as total FROM employees e JOIN users u ON e.user_id = u.id WHERE u.role = 'EMPLOYEE'`;
    const countParams = [];
    if (search) {
      countQuery += ` AND (e.name LIKE ? OR e.email LIKE ? OR e.employee_code LIKE ? OR e.designation LIKE ?)`;
      const sPattern = `%${search}%`;
      countParams.push(sPattern, sPattern, sPattern, sPattern);
    }
    if (department) {
      countQuery += ` AND e.department = ?`;
      countParams.push(department);
    }
    if (status) {
      countQuery += ` AND e.status = ?`;
      countParams.push(status);
    }

    const { total } = await db.get(countQuery, countParams);

    return res.json({
      success: true,
      employees,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Fetch employees error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch employees list.' });
  }
}


export async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;
    const employee = await db.get(
      `SELECT e.*, u.role FROM employees e JOIN users u ON e.user_id = u.id WHERE e.id = ?`,
      [id]
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    return res.json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch employee details.' });
  }
}

export async function createEmployee(req, res) {
  try {
    const { name, email, phone, department, designation, date_of_joining, role = 'EMPLOYEE', password } = req.body;

    if (!name || !email || !phone || !department || !designation || !date_of_joining) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const existingUser = await db.get(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An employee with this email already exists.' });
    }

    const initialPassword = password || 'Password123!';
    const passwordHash = await bcrypt.hash(initialPassword, 10);

    // 1. Create User
    const userRes = await db.run(
      `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
      [email.toLowerCase().trim(), passwordHash, role]
    );

    // 2. Generate Employee Code
    const countRes = await db.get(`SELECT COUNT(*) as total FROM employees`);
    const codeNumber = (countRes.total + 1).toString().padStart(3, '0');
    const employeeCode = `EMP-${role === 'HR' ? 'HR' : ''}${codeNumber}`;

    // 3. Create Employee Profile
    const empRes = await db.run(
      `INSERT INTO employees (user_id, employee_code, name, email, phone, department, designation, date_of_joining)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userRes.lastID, employeeCode, name, email.toLowerCase().trim(), phone, department, designation, date_of_joining]
    );

    // 4. Send Welcome Notification
    await db.run(
      `INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)`,
      [userRes.lastID, 'Welcome to HRMS', `Your account has been created. Code: ${employeeCode}`]
    );

    const newEmployee = await db.get(`SELECT * FROM employees WHERE id = ?`, [empRes.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully.',
      employee: newEmployee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create employee.' });
  }
}

export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, department, designation, date_of_joining, status } = req.body;

    const existing = await db.get(`SELECT * FROM employees WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    await db.run(
      `UPDATE employees 
       SET name = ?, phone = ?, department = ?, designation = ?, date_of_joining = ?, status = ?
       WHERE id = ?`,
      [
        name || existing.name,
        phone || existing.phone,
        department || existing.department,
        designation || existing.designation,
        date_of_joining || existing.date_of_joining,
        status || existing.status,
        id
      ]
    );

    const updated = await db.get(`SELECT * FROM employees WHERE id = ?`, [id]);

    return res.json({
      success: true,
      message: 'Employee profile updated successfully.',
      employee: updated
    });
  } catch (error) {
    console.error('Update employee error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update employee profile.' });
  }
}

export async function updateSelfProfile(req, res) {
  try {
    const employeeId = req.user.employee_id;
    const { name, phone, avatar } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'No employee record associated with user.' });
    }

    const existing = await db.get(`SELECT * FROM employees WHERE id = ?`, [employeeId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Employee record not found.' });
    }

    await db.run(
      `UPDATE employees SET name = ?, phone = ?, avatar = ? WHERE id = ?`,
      [name || existing.name, phone || existing.phone, avatar !== undefined ? avatar : existing.avatar, employeeId]
    );

    const updated = await db.get(`SELECT * FROM employees WHERE id = ?`, [employeeId]);

    return res.json({
      success: true,
      message: 'Personal profile updated.',
      employee: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}

function getFieldValue(item, keys, fallback = '') {
  if (!item || typeof item !== 'object') return fallback;
  for (let k of keys) {
    const target = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (let key in item) {
      if (key.trim().toLowerCase().replace(/[^a-z0-9]/g, '') === target) {
        const val = item[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          return String(val).trim();
        }
      }
    }
  }
  return fallback;
}

export async function bulkCreateEmployees(req, res) {
  try {
    const { employees } = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid array of employee records.' });
    }

    let addedCount = 0;
    let skippedCount = 0;
    const errors = [];

    const defaultPasswordHash = await bcrypt.hash('Password123!', 10);
    const today = new Date().toISOString().split('T')[0];

    for (let index = 0; index < employees.length; index++) {
      const item = employees[index];

      const name = getFieldValue(item, ['name', 'fullname', 'employeename', 'employee']);
      const email = getFieldValue(item, ['email', 'workemail', 'emailaddress', 'mail']);
      const phone = getFieldValue(item, ['phone', 'phonenumber', 'contact', 'mobile', 'cell'], '+1 (555) 000-0000');
      const department = getFieldValue(item, ['department', 'dept', 'division'], 'Engineering');
      const designation = getFieldValue(item, ['designation', 'title', 'position', 'roletitle', 'role_title'], 'Staff Member');
      const date_of_joining = getFieldValue(item, ['dateofjoining', 'joiningdate', 'doj', 'startdate', 'date'], today);
      const roleRaw = getFieldValue(item, ['role', 'userrole', 'accessrole'], 'EMPLOYEE');
      const role = roleRaw.toUpperCase() === 'HR' ? 'HR' : 'EMPLOYEE';

      if (!name || !email) {
        errors.push(`Row ${index + 1}: Name and Email are required.`);
        skippedCount++;
        continue;
      }

      const cleanEmail = String(email).trim().toLowerCase();

      // Check duplicate
      const existingUser = await db.get(`SELECT * FROM users WHERE email = ?`, [cleanEmail]);
      if (existingUser) {
        skippedCount++;
        continue;
      }

      // Create User
      const userRes = await db.run(
        `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
        [cleanEmail, defaultPasswordHash, role]
      );

      // Generate Code
      const countRes = await db.get(`SELECT COUNT(*) as total FROM employees`);
      const codeNumber = (countRes.total + 1).toString().padStart(3, '0');
      const employeeCode = `EMP-${role === 'HR' ? 'HR' : ''}${codeNumber}`;

      // Insert Employee Profile
      await db.run(
        `INSERT INTO employees (user_id, employee_code, name, email, phone, department, designation, date_of_joining)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userRes.lastID, employeeCode, String(name).trim(), cleanEmail, String(phone).trim(), String(department).trim(), String(designation).trim(), date_of_joining]
      );

      // Send Welcome Notification
      await db.run(
        `INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)`,
        [userRes.lastID, 'Welcome to HRMS', `Account created via bulk import. Code: ${employeeCode}`]
      );

      addedCount++;
    }

    return res.status(201).json({
      success: true,
      message: `Bulk import completed: ${addedCount} added, ${skippedCount} skipped.`,
      addedCount,
      skippedCount,
      errors
    });
  } catch (error) {
    console.error('Bulk create employee error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process bulk import.' });
  }
}


export async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    const emp = await db.get(`SELECT * FROM employees WHERE id = ?`, [id]);

    if (!emp) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Delete associated user account which cascades employee record
    await db.run(`DELETE FROM users WHERE id = ?`, [emp.user_id]);

    return res.json({ success: true, message: 'Employee deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete employee.' });
  }
}


import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import * as XLSX from 'xlsx';
import { UserPlus, Search, Filter, Edit3, Trash2, Mail, Phone, Building, Briefcase, Calendar, FileSpreadsheet, UploadCloud, Download, CheckCircle2, AlertCircle } from 'lucide-react';

function getRowVal(row, keys, fallback = '') {
  if (!row || typeof row !== 'object') return fallback;
  for (let k of keys) {
    const target = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (let key in row) {
      if (key.trim().toLowerCase().replace(/[^a-z0-9]/g, '') === target) {
        const val = row[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          return String(val).trim();
        }
      }
    }
  }
  return fallback;
}

export default function EmployeeManagement() {
  const { showToast } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Bulk Upload State
  const [parsedPreview, setParsedPreview] = useState([]);
  const [fileName, setFileName] = useState('');
  const [bulkImporting, setBulkImporting] = useState(false);

  // Single Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    date_of_joining: new Date().toISOString().split('T')[0],
    role: 'EMPLOYEE',
    password: 'Password123!'
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.getEmployees({ search, department, page });
      setEmployees(res.employees);
      setPagination(res.pagination);
    } catch (err) {
      showToast('Failed to load employees', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department, page]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createEmployee(formData);
      showToast('Employee created successfully!', 'success');
      setIsAddModalOpen(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      showToast(err.message || 'Failed to create employee', 'danger');
    }
  };

  const handleEditClick = (emp) => {
    setSelectedEmp(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation,
      date_of_joining: emp.date_of_joining,
      status: emp.status
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateEmployee(selectedEmp.id, formData);
      showToast('Employee updated successfully!', 'success');
      setIsEditModalOpen(false);
      fetchEmployees();
    } catch (err) {
      showToast(err.message || 'Failed to update employee', 'danger');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete employee "${name}"?`)) {
      try {
        await api.deleteEmployee(id);
        showToast('Employee deleted.', 'info');
        fetchEmployees();
      } catch (err) {
        showToast('Failed to delete employee', 'danger');
      }
    }
  };

  // --- Bulk CSV / Excel Upload Handler ---
  const handleDownloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Email,Phone,Department,Designation,Date of Joining,Role\n" +
      "Michael Scott,michael.scott@company.com,+1 (555) 789-0123,Sales,Regional Manager,2024-02-01,EMPLOYEE\n" +
      "Pam Beesly,pam.beesly@company.com,+1 (555) 890-1234,Administration,Office Administrator,2024-02-15,EMPLOYEE\n" +
      "Jim Halpert,jim.halpert@company.com,+1 (555) 901-2345,Sales,Assistant Regional Manager,2024-03-01,EMPLOYEE";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_bulk_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet to JSON rows
        const records = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (records.length === 0) {
          showToast('No valid employee records found in file.', 'danger');
          setParsedPreview([]);
        } else {
          setParsedPreview(records);
          showToast(`Parsed ${records.length} employee records ready for import!`, 'success');
        }
      } catch (err) {
        console.error('File parse error:', err);
        showToast('Error reading Excel/CSV file.', 'danger');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleBulkSubmit = async () => {
    if (parsedPreview.length === 0) {
      showToast('Please select or upload a valid file first.', 'danger');
      return;
    }

    setBulkImporting(true);
    try {
      const res = await api.bulkCreateEmployees({ employees: parsedPreview });
      showToast(res.message, 'success');
      setIsBulkModalOpen(false);
      setParsedPreview([]);
      setFileName('');
      fetchEmployees();
    } catch (err) {
      showToast(err.message || 'Failed to bulk import employees', 'danger');
    } finally {
      setBulkImporting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Engineering',
      designation: 'Software Engineer',
      date_of_joining: new Date().toISOString().split('T')[0],
      role: 'EMPLOYEE',
      password: 'Password123!'
    });
  };

  const departments = ['Engineering', 'Human Resources', 'Product & Design', 'Marketing', 'Sales', 'Finance', 'Administration'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Actions & Filters Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by name, email, code or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => { setParsedPreview([]); setFileName(''); setIsBulkModalOpen(true); }}
            title="Upload CSV / Excel File"
          >
            <FileSpreadsheet size={18} /> Bulk Import (Excel/CSV)
          </button>

          <button
            className="btn btn-primary"
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          >
            <UserPlus size={18} /> Add New Employee
          </button>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="glass-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Employee Name</th>
                <th>Contact</th>
                <th>Department & Designation</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading workforce list...</td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, background: 'var(--bg-input)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {emp.employee_code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{emp.name}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.825rem' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{emp.email}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{emp.phone}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{emp.designation}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.department}</span>
                      </div>
                    </td>
                    <td>{emp.date_of_joining}</td>
                    <td>
                      <span className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEditClick(emp)}
                          title="Edit Details"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(emp.id, emp.name)}
                          title="Delete Employee"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No employees matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Import Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Import Employees via Excel / CSV"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsBulkModalOpen(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleBulkSubmit}
              disabled={parsedPreview.length === 0 || bulkImporting}
            >
              {bulkImporting ? 'Importing...' : `Import ${parsedPreview.length} Employees`}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Instructions & Download Template */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Download Sample Template</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Pre-formatted CSV template with required column headers.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadTemplate}>
              <Download size={14} /> Download Template
            </button>
          </div>

          {/* Upload Area */}
          <div style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(99, 102, 241, 0.04)',
            cursor: 'pointer',
            position: 'relative'
          }}>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
            <UploadCloud size={36} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              {fileName ? fileName : 'Click or Drag & Drop Excel / CSV file to upload'}
            </h4>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Supports .csv, .xlsx, and .xls spreadsheets
            </span>
          </div>

          {/* Parsed Preview Table */}
          {parsedPreview.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-success)' }}>
                  ✓ {parsedPreview.length} Records Parsed Successfully
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preview first 5 records</span>
              </div>

              <div className="table-responsive" style={{ maxHeight: '180px' }}>
                <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedPreview.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{getRowVal(row, ['name', 'fullname', 'employeename', 'employee'])}</td>
                        <td>{getRowVal(row, ['email', 'workemail', 'emailaddress', 'mail'])}</td>
                        <td>{getRowVal(row, ['phone', 'phonenumber', 'contact', 'mobile'])}</td>
                        <td>{getRowVal(row, ['department', 'dept'])}</td>
                        <td>{getRowVal(row, ['designation', 'title', 'position'])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>


      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateSubmit}>Save Employee</button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sarah Connor"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Work Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@company.com"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Department</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Lead Developer"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Date of Joining</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.date_of_joining}
                onChange={(e) => setFormData({ ...formData, date_of_joining: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR Manager</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee Details"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>Update Employee</button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Department</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}


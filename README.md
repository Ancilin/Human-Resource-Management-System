# Workforce HRMS - Human Resource Management System

A full-stack **Human Resource Management System (HRMS)** built with **React (Vite)**, **Node.js (Express)**, **SQLite**, and **JWT Authentication**. Features distinct HR and Employee portals with role-based access control, attendance tracking, leave management, employee directory with search & multi-filtering, and responsive dark/light themes.

---

## 🌟 Key Features

### 🏢 HR Portal
- **Executive Dashboard**: Displays real-time metrics (Total Workforce, Present Today, On Leave Today, Pending Leaves) and attendance stream.
- **Employee Management (CRUD)**: Add, edit, search, filter by department, and deactivate employee accounts.
- **Attendance Management**: View company-wide check-in/check-out logs, filter by employee name/code, or specific date.
- **Leave Management**: Review leave requests, approve or reject with manager comments, auto-updating employee leave balances and attendance records.

### 👤 Employee Portal
- **Employee Dashboard**: View personal profile summary, today's attendance status, leave quota breakdown, and system notifications.
- **Attendance Punch System**: Interactive **Check In** and **Check Out** buttons with automatic work hour calculation.
- **Leave Applications**: Submit leave requests (Paid, Sick, Casual, Unpaid) with date range selection and track real-time approval status.
- **Profile & Security**: Update contact details and securely change passwords with `bcrypt` hash verification.

### 🎨 General & Bonus Features
- 🌙 **Dark & Light Mode**: Toggleable modern glassmorphic interface with CSS custom properties.
- 📱 **Responsive Design**: Designed for desktop, tablet, and mobile screens.
- 🔍 **Search & Multi-Filter**: Real-time multi-column search and dropdown filtering.
- 🔐 **Secure Auth**: JWT token authentication with role enforcement middleware and salted password hashes.
- ⚡ **Zero-Config Database**: Self-contained SQLite database file pre-seeded with realistic test accounts.

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd "Human Resource Management System"
   ```

2. **Install Dependencies**:
   From the root folder, run:
   ```bash
   npm run setup
   ```
   *(Or manually run `npm install` inside both `./backend` and `./frontend` folders).*

3. **Start Development Servers**:
   - **Start Backend API** (Port 5000):
     ```bash
     cd backend
     npm start
     ```
   - **Start Frontend App** (Port 5173):
     ```bash
     cd frontend
     npm run dev
     ```

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Pre-Seeded Demo Login Credentials

For instant evaluation, the login page features quick-fill buttons for demo credentials:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **HR Manager** | `hr@company.com` | `Password123!` | Full HR Admin Portal |
| **Employee 1** | `john.doe@company.com` | `Password123!` | Employee Portal (Engineering) |
| **Employee 2** | `jane.smith@company.com` | `Password123!` | Employee Portal (Product & Design) |
| **Employee 3** | `alex.jones@company.com` | `Password123!` | Employee Portal (Marketing) |

---

## 🛠️ API Reference Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user details |
| `POST` | `/api/auth/change-password` | Authenticated | Change user account password |
| `GET` | `/api/dashboard/hr` | HR Only | Get HR executive dashboard stats |
| `GET` | `/api/dashboard/employee` | Employee / HR | Get personal employee dashboard data |
| `GET` | `/api/employees` | HR Only | List employees with search & filters |
| `POST` | `/api/employees` | HR Only | Create new employee profile and user account |
| `PUT` | `/api/employees/:id` | HR Only | Update employee details |
| `DELETE` | `/api/employees/:id` | HR Only | Delete employee account |
| `POST` | `/api/attendance/check-in` | Authenticated | Clock in for today |
| `POST` | `/api/attendance/check-out` | Authenticated | Clock out for today |
| `GET` | `/api/attendance/all` | HR Only | View master attendance logs |
| `POST` | `/api/leave/apply` | Authenticated | Submit leave application |
| `GET` | `/api/leave/all` | HR Only | View all company leave requests |
| `PUT` | `/api/leave/:id/review` | HR Only | Approve or Reject leave request |

---

## 📁 Repository Structure

```
Human Resource Management System/
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/           # Database configuration (SQLite)
│   │   ├── controllers/      # Business logic handlers
│   │   ├── db/               # Schema initialization & seed script
│   │   ├── middleware/       # JWT auth & RBAC role protection
│   │   ├── routes/           # API router modules
│   │   └── server.js         # Server entrypoint
│   └── package.json
├── frontend/                 # React + Vite Web Application
│   ├── src/
│   │   ├── components/       # Reusable UI (Sidebar, Header, Table, Modal, Toast)
│   │   ├── context/          # Auth & Theme context providers
│   │   ├── pages/            # HR & Employee view modules
│   │   ├── services/         # API fetch client
│   │   ├── styles/           # Global design system & theme CSS
│   │   ├── App.jsx           # App router layout
│   │   └── main.jsx
│   └── package.json
├── APPROACH.md               # Technical approach & AI disclosure document
├── SCHEMA.md                 # Database schema & ER Diagram (Mermaid)
├── README.md                 # Project documentation
└── package.json              # Root project scripts
```

---

## 📄 License & Attribution

Submitted for full-stack engineering evaluation. Includes AI tool assistance disclosure in `APPROACH.md`.

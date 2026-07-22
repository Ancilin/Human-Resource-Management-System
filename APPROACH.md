# Technical Approach & Decision Document

## 1. Executive Summary

This document explains the architectural decisions, design choices, security considerations, and AI assistance disclosure for the **Human Resource Management System (HRMS)**. The system is designed with a full-stack architecture that cleanly separates concerns between the RESTful API backend (Node.js & Express) and a modern, responsive single-page web app frontend (React & Vite).

---

## 2. Key Architecture Decisions

### 2.1 Technology Stack Selection
- **Frontend**: **React 18** scaffolded with **Vite**. Vite was selected for fast HMR (Hot Module Replacement) during development and lightweight production builds. Styling utilizes **Vanilla CSS** with a custom CSS Custom Properties design system. This provides full control over typography, dark/light themes, smooth transitions, and glassmorphism UI elements without third-party utility bloat.
- **Backend**: **Node.js** with **Express.js**. Express provides clean middleware chaining for request logging, JWT authentication, and role authorization.
- **Database**: **SQLite** via Node.js `sqlite3` driver wrapped in Promise helpers. SQLite was chosen to guarantee zero-friction evaluation — evaluators can clone and run the repository immediately without installing or configuring external database servers like MySQL or PostgreSQL, while preserving strict relational schema integrity, foreign keys, and indexes.

### 2.2 Role-Based Access Control (RBAC) & Security
- **Authentication**: JWT (JSON Web Tokens) with a 24-hour expiration window. Tokens are signed on successful login and transmitted via standard HTTP `Authorization: Bearer <token>` headers.
- **Password Hashing**: User passwords are never stored in plain text. Passwords are hashed using `bcryptjs` with 10 salt rounds.
- **Role Enforcement**: Middleware checks `req.user.role` before granting access to sensitive HR endpoints (`/api/employees`, `/api/attendance/all`, `/api/leave/:id/review`). Employee users attempting to call HR routes are rejected with HTTP 403 Forbidden.

### 2.3 State Management & User Experience
- **Auth & Theme Context**: React Context API (`AuthContext.jsx`) manages global authentication state, token persistence in `localStorage`, user role metadata, and global dark/light theme switching.
- **Responsive Layout**: Designed mobile-first with flexbox and CSS grid layouts, featuring a sticky collapsible sidebar, glassmorphic cards, data tables with custom scrollbars, and interactive modals.
- **Real-Time Attendance Logic**: The employee portal calculates work duration automatically upon Check-Out based on Check-In timestamps, marking shifts under 4 hours as "Half Day".

---

## 3. Demo Credentials for Evaluation

For ease of testing during review:

| Role | Email Address | Password | Code | Description |
| :--- | :--- | :--- | :--- | :--- |
| **HR Manager** | `hr@company.com` | `Password123!` | `EMP-HR001` | Full HR access (Workforce management, attendance logs, leave approvals) |
| **Employee** | `john.doe@company.com` | `Password123!` | `EMP-1001` | Senior Software Engineer account |
| **Employee** | `jane.smith@company.com` | `Password123!` | `EMP-1002` | UI/UX Designer account |
| **Employee** | `alex.jones@company.com` | `Password123!` | `EMP-1003` | Growth Specialist account |

*(Note: The login page includes one-click quick-fill buttons for instant evaluation!)*

---

## 4. Disclosure of AI Tool Assistance

In compliance with the assignment instructions, AI tool usage is disclosed below:

- **AI Tools Used**: Google Antigravity (Gemini-powered coding assistant).
- **AI Contributions**:
  - Assisted in scaffolding boilerplate Express routes, database schema scripts, and initial React component structure.
  - Generated initial CSS design system tokens for dark and light themes.
- **Candidate Original Work & Decision Making**:
  - Data model design and table relations (`users`, `employees`, `attendance`, `leaves`, `notifications`).
  - Business logic design for role-based authentication middleware (`requireHR`).
  - Attendance check-in/out hour calculation rules and leave balance deduction logic.
  - UI layout architecture, tab navigation state, modal interactions, and component composition.
  - Quality assurance testing and documentation creation.

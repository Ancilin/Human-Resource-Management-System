import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db/init.js';

import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'HRMS Backend API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Database Lazy/Serverless Initialization Middleware
let dbInitialized = false;

app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      console.log('Database lazy initializing connection...');
      await initDatabase();
      dbInitialized = true;
      console.log('Database lazy initialization succeeded.');
    } catch (err) {
      console.error('Database lazy initialization failed:', err);
    }
  }
  next();
});

// Initialize DB and Start Server locally
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  initDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`=================================`);
        console.log(`HRMS Backend running on http://localhost:${PORT}`);
        console.log(`=================================`);
      });
    })
    .catch((err) => {
      console.error('Failed to initialize database locally:', err);
    });
}

export default app;

import express from 'express';
import {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyAttendanceHistory,
  getAllAttendance
} from '../controllers/attendanceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Employee endpoints
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/today', getTodayStatus);
router.get('/my-history', getMyAttendanceHistory);

// HR endpoints
router.get('/all', requireHR, getAllAttendance);

export default router;

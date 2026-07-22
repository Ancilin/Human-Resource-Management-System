import express from 'express';
import { getHRDashboard, getEmployeeDashboard } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/hr', requireHR, getHRDashboard);
router.get('/employee', getEmployeeDashboard);

export default router;

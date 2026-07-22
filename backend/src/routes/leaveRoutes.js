import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  reviewLeave
} from '../controllers/leaveController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Employee endpoints
router.post('/apply', applyLeave);
router.get('/my-leaves', getMyLeaves);

// HR endpoints
router.get('/all', requireHR, getAllLeaves);
router.put('/:id/review', requireHR, reviewLeave);

export default router;

import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  bulkCreateEmployees,
  updateEmployee,
  updateSelfProfile,
  deleteEmployee
} from '../controllers/employeeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Self profile update (Any authenticated user)
router.put('/profile/me', updateSelfProfile);

// HR Only endpoints
router.get('/', requireHR, getAllEmployees);
router.get('/:id', requireHR, getEmployeeById);
router.post('/', requireHR, createEmployee);
router.post('/bulk', requireHR, bulkCreateEmployees);
router.put('/:id', requireHR, updateEmployee);
router.delete('/:id', requireHR, deleteEmployee);

export default router;


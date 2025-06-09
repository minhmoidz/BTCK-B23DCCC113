import express from 'express';
import {
  createNotification,
  getAllNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  togglePin,
  toggleImportant
} from '../../controllers/notificationController.mjs';
import { authMiddleware, isAdmin } from '../../auth.mjs';

const router = express.Router();

// Các route cho thông báo - yêu cầu xác thực và quyền admin
router.post('/', authMiddleware, isAdmin, createNotification);
router.get('/', getAllNotifications);
router.get('/:id', getNotification);
router.put('/:id', authMiddleware, isAdmin, updateNotification);
router.delete('/:id', authMiddleware, isAdmin, deleteNotification);

// Routes mới cho việc ghim và đánh dấu quan trọng
router.patch('/:id/toggle-pin', togglePin);
router.patch('/:id/toggle-important', toggleImportant);

export const notificationRoutes = router; 
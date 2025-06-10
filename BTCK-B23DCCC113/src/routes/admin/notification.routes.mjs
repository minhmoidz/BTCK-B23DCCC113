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
import upload from '../../middleware/upload.middleware.mjs';

const router = express.Router();

// Các route cho thông báo - yêu cầu xác thực và quyền admin
router.post('/', authMiddleware, isAdmin, upload.single('image'), createNotification);
router.get('/', getAllNotifications);
router.get('/:id', getNotification);
router.put('/:id', authMiddleware, isAdmin, upload.single('image'), updateNotification);
router.delete('/:id', authMiddleware, isAdmin, deleteNotification);

// Routes mới cho việc ghim và đánh dấu quan trọng
router.patch('/:id/toggle-pin', authMiddleware, isAdmin, togglePin);
router.patch('/:id/toggle-important', authMiddleware, isAdmin, toggleImportant);

export default router; 
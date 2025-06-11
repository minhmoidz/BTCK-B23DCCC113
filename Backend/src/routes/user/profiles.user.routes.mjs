import express from 'express';
import { authMiddleware } from '../../auth.mjs';
import { adminAuth } from '../../middleware/validation.middleware.mjs';
import { getUserProfiles, getAdminProfiles, updateAdminProfileStatus } from '../../controllers/user.controller.mjs';

const router = express.Router();

// --- API lấy hồ sơ của user ---
router.get('/hoso', authMiddleware, getUserProfiles);

// --- API admin lấy danh sách hồ sơ ---
router.get('/admin/profiles', adminAuth, getAdminProfiles);

// --- API admin cập nhật trạng thái hồ sơ ---
router.post('/admin/profiles/:id/status', adminAuth, updateAdminProfileStatus);

export default router; 
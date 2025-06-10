import express from 'express';
import { adminAuth } from '../../middleware/validation.middleware.mjs';
import { getMajorStatisticsPublic, getSchoolStatisticsAdmin } from '../../controllers/user.controller.mjs';

const router = express.Router();

// --- API thống kê hồ sơ theo ngành (public) ---
router.get('/statistics/majors', getMajorStatisticsPublic);

// --- API thống kê hồ sơ theo trường (admin) ---
router.get('/admin/statistics/schools', adminAuth, getSchoolStatisticsAdmin);

export default router; 
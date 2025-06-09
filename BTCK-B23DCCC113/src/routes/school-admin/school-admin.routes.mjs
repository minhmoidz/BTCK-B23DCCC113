import express from 'express';
import { isSchoolAdmin } from '../../auth.mjs';
import {
    getSchoolDashboard,
    getSchoolProfiles,
    updateProfileStatusWithNote,
    getProfileDetail,
    getMethodStatistics,
    getAdmissionQuotaAndResults
} from '../../controllers/school-admin.controller.mjs';

const router = express.Router();

// Middleware xác thực school admin cho tất cả routes
router.use(isSchoolAdmin);

// Dashboard và thống kê
router.get('/dashboard', getSchoolDashboard);
router.get('/statistics/methods', getMethodStatistics);

// Quản lý hồ sơ
router.get('/profiles', getSchoolProfiles);
router.get('/profiles/:id', getProfileDetail);
router.put('/profiles/:id/status', updateProfileStatusWithNote);

// Chỉ tiêu và kết quả xét tuyển
router.get('/admission/quota-results', getAdmissionQuotaAndResults);

export default router; 
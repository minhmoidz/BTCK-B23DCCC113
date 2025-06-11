import express from 'express';
import {
    getGeneralStatistics,
    getPopularSchoolsStatistics,
    getUserRegistrationStatisticsByTime,
    getProfileSubmissionStatisticsByTime,
    getComparisonStatistics
} from '../../controllers/public.controller.mjs';

const router = express.Router();

// API thống kê tổng quan
router.get('/tong-quan', getGeneralStatistics);

// API thống kê trường có nhiều người đăng ký nhất
router.get('/truong-pho-bien', getPopularSchoolsStatistics);

// API thống kê user đăng ký theo thời gian
router.get('/user-theo-thoi-gian', getUserRegistrationStatisticsByTime);

// API thống kê hồ sơ nộp theo thời gian
router.get('/ho-so-theo-thoi-gian', getProfileSubmissionStatisticsByTime);

// API so sánh số user đăng ký vs số hồ sơ nộp
router.get('/so-sanh', getComparisonStatistics);

export { router as statisticsRoutes }; 
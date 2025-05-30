import express from 'express';
import { submitApplication, lookupApplication } from '../../controllers/public.controller.mjs';

const router = express.Router();

// API nộp hồ sơ xét tuyển - CHÍNH
router.post('/nop-ho-so', submitApplication);

// API tra cứu hồ sơ
router.get('/tra-cuu/:maHoSo', lookupApplication);

export { router as applicationRoutes }; 
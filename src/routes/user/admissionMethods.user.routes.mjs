import express from 'express';
import { getAdmissionMethods, getAdmissionMethodRequirements } from '../../controllers/user.controller.mjs';

const router = express.Router();

// --- API lấy danh sách phương thức xét tuyển ---
router.get('/phuongthuc-xettuyen', getAdmissionMethods);

// --- API lấy thông tin yêu cầu của từng phương thức xét tuyển ---
router.get('/phuongthuc-xettuyen/:phuongThuc/requirements', getAdmissionMethodRequirements);

export default router; 
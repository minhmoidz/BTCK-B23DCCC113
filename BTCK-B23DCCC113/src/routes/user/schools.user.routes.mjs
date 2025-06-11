import express from 'express';
import { getSchoolsList } from '../../controllers/user.controller.mjs';

const router = express.Router();

// --- API lấy danh sách trường ---
router.get('/truong', getSchoolsList);

export default router; 
import express from 'express';
import { getMajorsBySchool } from '../../controllers/user.controller.mjs';

const router = express.Router();

// --- API lấy danh sách ngành theo trường ---
router.get('/nganh/:truongKey', getMajorsBySchool);

export default router; 
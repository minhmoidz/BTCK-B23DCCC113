import express from 'express';
import { getSubjectGroupsBySchoolAndMajor } from '../../controllers/user.controller.mjs';

const router = express.Router();

// --- API lấy danh sách tổ hợp môn theo trường và ngành ---
router.get('/tohop/:truongKey/:nganhKey', getSubjectGroupsBySchoolAndMajor);

export default router; 
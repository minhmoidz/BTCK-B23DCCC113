import express from 'express';
import {
    getSchoolsPublic,
    getMajorsBySchoolPublic,
    getSubjectGroupsBySchoolAndMajorPublic,
    debugCheckData
} from '../../controllers/public.controller.mjs';

const router = express.Router();

// API lấy danh sách trường cho form xét tuyển
router.get('/truong', getSchoolsPublic);

// API lấy danh sách ngành theo trường
router.get('/nganh/:truongKey', getMajorsBySchoolPublic);

// API lấy tổ hợp môn theo trường và ngành
router.get('/tohop/:truongKey/:nganhKey', getSubjectGroupsBySchoolAndMajorPublic);

// API debug để kiểm tra dữ liệu
router.get('/debug/check-data/:schoolId/:majorId', debugCheckData);

export { router as schoolRoutes }; 
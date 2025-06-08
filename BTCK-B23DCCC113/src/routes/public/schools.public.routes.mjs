import express from 'express';
import {
    getSchoolsPublic,
    getMajorsBySchoolPublic,
    getSubjectGroupsBySchoolAndMajorPublic,
    debugCheckData
} from '../../controllers/public.controller.mjs';

const router = express.Router();

/**
 * @swagger
 * /api/truong:
 *   get:
 *     summary: Lấy danh sách tất cả các trường
 *     tags: [Public - Trường Học]
 *     description: Trả về danh sách các trường học có trong hệ thống, dùng cho các form chọn trường công khai.
 *     responses:
 *       200:
 *         description: Danh sách các trường.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Mã trường.
 *                   name:
 *                     type: string
 *                     description: Tên trường.
 *       500:
 *         description: Lỗi server.
 */
router.get('/truong', getSchoolsPublic);

/**
 * @swagger
 * /api/nganh/{truongKey}:
 *   get:
 *     summary: Lấy danh sách ngành theo trường
 *     tags: [Public - Trường Học]
 *     description: Trả về danh sách các ngành học của một trường cụ thể.
 *     parameters:
 *       - in: path
 *         name: truongKey
 *         required: true
 *         description: Mã của trường cần lấy danh sách ngành.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách các ngành của trường.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Mã ngành.
 *                   name:
 *                     type: string
 *                     description: Tên ngành.
 *       400:
 *         description: Thiếu mã trường.
 *       500:
 *         description: Lỗi server.
 */
router.get('/nganh/:truongKey', getMajorsBySchoolPublic);

/**
 * @swagger
 * /api/tohop/{truongKey}/{nganhKey}:
 *   get:
 *     summary: Lấy danh sách tổ hợp môn theo trường và ngành
 *     tags: [Public - Trường Học]
 *     description: Trả về danh sách các tổ hợp môn xét tuyển cho một ngành cụ thể của một trường.
 *     parameters:
 *       - in: path
 *         name: truongKey
 *         required: true
 *         description: Mã của trường.
 *         schema:
 *           type: string
 *       - in: path
 *         name: nganhKey
 *         required: true
 *         description: Mã của ngành.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách các tổ hợp môn.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Mã tổ hợp.
 *                   name:
 *                     type: string
 *                     description: Tên tổ hợp (danh sách các môn).
 *       400:
 *         description: Thiếu mã trường hoặc mã ngành.
 *       500:
 *         description: Lỗi server.
 */
router.get('/tohop/:truongKey/:nganhKey', getSubjectGroupsBySchoolAndMajorPublic);

// API debug để kiểm tra dữ liệu
router.get('/debug/check-data/:schoolId/:majorId', debugCheckData);

export { router as schoolRoutes }; 
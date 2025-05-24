import express from 'express';
import {
  getAllNganhs,
  getNganhByTruong,
  getNganhById,
  createNganh,
  updateNganh,
  deleteNganh
} from '../controllers/nganhController.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ngành Học
 *   description: API quản lý các ngành học
 */

// === Các API Public ===
/**
 * @swagger
 * /api/nganh/all:
 *   get:
 *     summary: "Lấy danh sách tất cả các ngành học (Public)"
 *     tags: [Ngành Học]
 *     responses:
 *       200:
 *         description: "Danh sách tất cả ngành học, có populate thông tin trường"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NganhOutput'
 *       500:
 *         description: "Lỗi server"
 */
router.get('/all', getAllNganhs);

/**
 * @swagger
 * /api/nganh/truong/{truongId}:
 *   get:
 *     summary: "Lấy danh sách ngành học theo ID của trường (Public)"
 *     tags: [Ngành Học]
 *     parameters:
 *       - in: path
 *         name: truongId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của trường học"
 *     responses:
 *       200:
 *         description: "Danh sách ngành học của trường"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NganhOutput'
 *       500:
 *         description: "Lỗi server"
 */
router.get('/truong/:truongId', getNganhByTruong);

/**
 * @swagger
 * /api/nganh/{id}:
 *   get:
 *     summary: "Lấy thông tin chi tiết một ngành học bằng ID (Public)"
 *     tags: [Ngành Học]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của ngành học"
 *     responses:
 *       200:
 *         description: "Thông tin chi tiết ngành học"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NganhOutput'
 *       404:
 *         description: "Không tìm thấy ngành học"
 *       500:
 *         description: "Lỗi server"
 */
router.get('/:id', getNganhById);

// === Các API yêu cầu quyền Admin ===
/**
 * @swagger
 * /api/nganh:
 *   post:
 *     summary: "Tạo một ngành học mới (Yêu cầu: Admin)"
 *     tags: [Ngành Học]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NganhInput'
 *     responses:
 *       201:
 *         description: "Tạo ngành thành công"
 *       400:
 *         description: "Dữ liệu không hợp lệ"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       409:
 *         description: "Mã ngành đã tồn tại"
 */
router.post('/', protect, authorize('admin'), createNganh);

/**
 * @swagger
 * /api/nganh/{id}:
 *   put:
 *     summary: "Cập nhật thông tin một ngành học (Yêu cầu: Admin)"
 *     tags: [Ngành Học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của ngành học cần cập nhật"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NganhInput'
 *     responses:
 *       200:
 *         description: "Cập nhật thành công"
 *       400:
 *         description: "Dữ liệu không hợp lệ"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       404:
 *         description: "Không tìm thấy ngành học"
 *       409:
 *         description: "Mã ngành đã tồn tại cho ngành khác"
 */
router.put('/:id', protect, authorize('admin'), updateNganh);

/**
 * @swagger
 * /api/nganh/{id}:
 *   delete:
 *     summary: "Xóa một ngành học (Yêu cầu: Admin)"
 *     tags: [Ngành Học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của ngành học cần xóa"
 *     responses:
 *       200:
 *         description: "Xóa ngành thành công"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       404:
 *         description: "Không tìm thấy ngành học"
 */
router.delete('/:id', protect, authorize('admin'), deleteNganh);

export default router; 
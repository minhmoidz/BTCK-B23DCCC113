import express from 'express';
import {
  createTruong,
  getAllTruongs,
  getTruongById,
  updateTruong,
  deleteTruong
} from '../controllers/truong.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trường Học
 *   description: API quản lý thông tin các trường học
 */

/**
 * @swagger
 * /api/truong:
 *   post:
 *     summary: "Tạo một trường học mới (Yêu cầu: Admin)"
 *     tags: [Trường Học]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TruongInput'
 *     responses:
 *       201:
 *         description: "Tạo trường thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 truong: { $ref: '#/components/schemas/Truong' }
 *       400:
 *         description: "Dữ liệu không hợp lệ"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       409:
 *         description: "Mã trường đã tồn tại"
 *       500:
 *         description: "Lỗi server"
 */
router.post('/', protect, authorize('admin'), createTruong);

/**
 * @swagger
 * /api/truong:
 *   get:
 *     summary: "Lấy danh sách tất cả các trường học (Public)"
 *     tags: [Trường Học]
 *     responses:
 *       200:
 *         description: "Danh sách các trường"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Truong'
 *       500:
 *         description: "Lỗi server"
 */
router.get('/', getAllTruongs);

/**
 * @swagger
 * /api/truong/{id}:
 *   get:
 *     summary: "Lấy thông tin chi tiết một trường học bằng ID (Public)"
 *     tags: [Trường Học]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của trường học"
 *     responses:
 *       200:
 *         description: "Thông tin chi tiết trường học"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Truong'
 *       404:
 *         description: "Không tìm thấy trường học"
 *       500:
 *         description: "Lỗi server"
 */
router.get('/:id', getTruongById);

/**
 * @swagger
 * /api/truong/{id}:
 *   put:
 *     summary: "Cập nhật thông tin một trường học (Yêu cầu: Admin)"
 *     tags: [Trường Học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của trường học cần cập nhật"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TruongInput'
 *     responses:
 *       200:
 *         description: "Cập nhật thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 truong: { $ref: '#/components/schemas/Truong' }
 *       400:
 *         description: "Dữ liệu không hợp lệ"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       404:
 *         description: "Không tìm thấy trường học để cập nhật"
 *       409:
 *         description: "Mã trường đã tồn tại cho trường khác"
 *       500:
 *         description: "Lỗi server"
 */
router.put('/:id', protect, authorize('admin'), updateTruong);

/**
 * @swagger
 * /api/truong/{id}:
 *   delete:
 *     summary: "Xóa một trường học (Yêu cầu: Admin)"
 *     tags: [Trường Học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của trường học cần xóa"
 *     responses:
 *       200:
 *         description: "Xóa trường thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       404:
 *         description: "Không tìm thấy trường học để xóa"
 *       500:
 *         description: "Lỗi server"
 */
router.delete('/:id', protect, authorize('admin'), deleteTruong);

export default router; 
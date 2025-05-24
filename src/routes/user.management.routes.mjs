import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  createPublicUser
} from '../controllers/user.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quản lý Người Dùng (Admin)
 *   description: API để Admin quản lý tài khoản người dùng
 */

/**
 * @swagger
 * tags:
 *   name: Người Dùng (Public)
 *   description: API public liên quan đến người dùng
 */

/**
 * @swagger
 * /api/users/public-register:
 *   post:
 *     summary: "Tạo một tài khoản người dùng mới (Public)"
 *     tags: [Người Dùng (Public)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string, format: email, example: "publicuser@example.com" }
 *               password: { type: string, format: password, minLength: 6, example: "securepassword123" }
 *               sdt: { type: string, nullable: true, example: "0123456789" }
 *               role: { type: string, enum: [user, admin], nullable: true, default: "user", description: "Vai trò của người dùng. Nếu không cung cấp, mặc định là 'user'. CẨN THẬN KHI CHO PHÉP SET ROLE PUBLICLY!" }
 *     responses:
 *       201:
 *         description: "Tạo người dùng thành công."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 user: { $ref: '#/components/schemas/UserOutput' }
 *       400:
 *         description: "Dữ liệu không hợp lệ (ví dụ: email thiếu, password ngắn)"
 *       409:
 *         description: "Email đã được sử dụng"
 *       500:
 *         description: "Lỗi server"
 */
router.post('/public-register', createPublicUser);

// Tất cả các route trong file này đều yêu cầu quyền Admin
router.use(protect, authorize('admin'));

/**
 * @swagger
 * /api/manage-users:
 *   get:
 *     summary: "Lấy danh sách tất cả người dùng (Admin)"
 *     tags: [Quản lý Người Dùng (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Danh sách người dùng (không bao gồm mật khẩu)"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserOutput' 
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       500:
 *         description: "Lỗi server"
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /api/manage-users/{id}:
 *   get:
 *     summary: "Lấy thông tin chi tiết một người dùng bằng ID (Admin)"
 *     tags: [Quản lý Người Dùng (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của người dùng"
 *     responses:
 *       200:
 *         description: "Thông tin chi tiết người dùng (không bao gồm mật khẩu)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserOutput'
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       404:
 *         description: "Không tìm thấy người dùng"
 *       500:
 *         description: "Lỗi server"
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/manage-users:
 *   post:
 *     summary: "Tạo một người dùng mới bởi Admin (Admin)"
 *     tags: [Quản lý Người Dùng (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string, format: email, example: "newuser@example.com" }
 *               password: { type: string, format: password, minLength: 6, example: "password123" }
 *               sdt: { type: string, nullable: true, example: "0987654321" }
 *               role: { type: string, enum: [user, admin], default: "user", example: "user" }
 *     responses:
 *       201:
 *         description: "Tạo người dùng thành công"
 *       400:
 *         description: "Dữ liệu không hợp lệ"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       409:
 *         description: "Email đã được sử dụng"
 *       500:
 *         description: "Lỗi server"
 */
router.post('/', createUserByAdmin);

/**
 * @swagger
 * /api/manage-users/{id}:
 *   put:
 *     summary: "Cập nhật thông tin người dùng bởi Admin (Admin)"
 *     tags: [Quản lý Người Dùng (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của người dùng cần cập nhật"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email, nullable: true, example: "updateduser@example.com" }
 *               password: { type: string, format: password, minLength: 6, nullable: true, description: "Để trống nếu không muốn đổi mật khẩu", example: "newpassword456" }
 *               sdt: { type: string, nullable: true, example: "0123456789" }
 *               role: { type: string, enum: [user, admin], nullable: true, example: "admin" }
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
 *         description: "Không tìm thấy người dùng"
 *       409:
 *         description: "Email đã được sử dụng bởi tài khoản khác"
 *       500:
 *         description: "Lỗi server"
 */
router.put('/:id', updateUserByAdmin);

/**
 * @swagger
 * /api/manage-users/{id}:
 *   delete:
 *     summary: "Xóa người dùng bởi Admin (Admin)"
 *     tags: [Quản lý Người Dùng (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID của người dùng cần xóa"
 *     responses:
 *       200:
 *         description: "Xóa người dùng thành công"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền (không phải Admin)"
 *       404:
 *         description: "Không tìm thấy người dùng"
 *       500:
 *         description: "Lỗi server"
 */
router.delete('/:id', deleteUserByAdmin);

export default router; 
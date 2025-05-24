import express from 'express';
import {
  // registerUser, // Sẽ được thay thế
  requestRegistrationOtp,
  verifyOtpAndRegister,
  loginWithPassword,
  requestLoginOtp,
  verifyOtpAndLogin
} from '../controllers/auth.controller.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API quản lý đăng ký và đăng nhập người dùng
 */

/**
 * @swagger
 * /api/auth/register/request-otp:
 *   post:
 *     summary: Bước 1 - Yêu cầu OTP để đăng ký tài khoản mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email muốn sử dụng để đăng ký
 *     responses:
 *       200:
 *         description: OTP đã được gửi thành công đến email
 *       400:
 *         description: Email là bắt buộc
 *       409:
 *         description: Email đã được sử dụng
 *       500:
 *         description: Lỗi server hoặc lỗi gửi email
 */
router.post('/register/request-otp', requestRegistrationOtp);

/**
 * @swagger
 * /api/auth/register/verify-otp:
 *   post:
 *     summary: Bước 2 - Xác minh OTP và hoàn tất đăng ký tài khoản
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 description: Mã OTP nhận được từ email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               sdt:
 *                 type: string
 *                 nullable: true
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Đăng ký tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserOutput'
 *       400:
 *         description: Dữ liệu không hợp lệ (thiếu email/otp/password, OTP sai/hết hạn)
 *       409:
 *         description: Email đã được đăng ký (có thể xảy ra nếu đăng ký giữa chừng)
 *       500:
 *         description: Lỗi server
 */
router.post('/register/verify-otp', verifyOtpAndRegister);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập bằng Email và Mật khẩu (Để test)
 *     tags: [Authentication]
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT token và thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user: { $ref: '#/components/schemas/UserOutput' }
 *                 message: { type: string }
 *       400:
 *         description: "Thiếu email hoặc mật khẩu"
 *       401:
 *         description: "Email hoặc mật khẩu không chính xác"
 *       500:
 *         description: "Lỗi server"
 */
router.post('/login', loginWithPassword);

/**
 * @swagger
 * /api/auth/login/request-otp:
 *   post:
 *     summary: Bước 1 - Yêu cầu gửi OTP để đăng nhập (Tên route đã đổi để rõ ràng hơn)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đã đăng ký của người dùng
 *     responses:
 *       200:
 *         description: OTP đã được gửi thành công
 *       400:
 *         description: Email là bắt buộc
 *       404:
 *         description: Email không tồn tại
 *       500:
 *         description: Lỗi server hoặc lỗi gửi email
 */
router.post('/login/request-otp', requestLoginOtp);

/**
 * @swagger
 * /api/auth/login/verify-otp:
 *   post:
 *     summary: Bước 2 - Đăng nhập bằng email và OTP đã xác thực (Tên route đã đổi để rõ ràng hơn)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT token và thông tin người dùng
 *       400:
 *         description: Email/OTP không hợp lệ hoặc đã hết hạn
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post('/login/verify-otp', verifyOtpAndLogin);

export default router; 
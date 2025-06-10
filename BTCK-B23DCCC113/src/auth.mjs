import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from './models/User.model.mjs';
import School from './models/School.model.mjs';

const router = express.Router();

// --- Cấu hình tài khoản Gmail để gửi mail ---
const EMAIL_USER = 'minhtuantran210305@gmail.com';
const EMAIL_PASS = 'akix ieej zluq gadj';

// --- Tạo transporter gửi mail ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// --- Lưu OTP tạm thời trong RAM ---
let otpStorage = {};

// --- Middleware xác thực người dùng ---
export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Chưa xác thực' });
  }
  const userId = auth.slice(7).trim();
  if (!userId) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
  req.userId = userId;
  next();
}

// --- Middleware kiểm tra email ---
function validateEmail(req, res, next) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email không được để trống!' });
  next();
}

// --- Middleware kiểm tra thông tin đăng ký ---
async function validateRegistration(req, res, next) {
  const { ten, sdt, email, password } = req.body;
  if (!ten || !sdt || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin (tên, số điện thoại, email, mật khẩu)!' });
  }
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  if (!phoneRegex.test(sdt)) {
    return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ!' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
  }
  
  // Kiểm tra trùng lặp trong MongoDB
  const sdtExists = await User.findOne({ sdt });
  if (sdtExists) {
    return res.status(400).json({ message: 'Số điện thoại đã được đăng ký!' });
  }
  
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: 'Email đã được đăng ký!' });
  }
  
  next();
}

// --- Middleware xác thực admin ---
export function adminAuth(req, res, next) {
  console.log('Admin auth middleware bypassed');
  next();
}

export const isAdmin = (req, res, next) => {
  console.log('isAdmin middleware bypassed');
  next();
};

// --- Hàm gửi email thông báo trúng tuyển ---
export async function sendAdmissionNotification(userEmail, userName, schoolName, majorName, method) {
  try {
    const mailOptions = {
      from: EMAIL_USER,
      to: userEmail,
      subject: 'Thông báo kết quả xét tuyển',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745; text-align: center;">🎉 CHÚC MỪNG BẠN ĐÃ TRÚNG TUYỂN! 🎉</h2>
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Chúng tôi vui mừng thông báo rằng bạn đã <strong style="color: #28a745;">TRÚNG TUYỂN</strong> vào:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
            <p><strong>🏫 Trường:</strong> ${schoolName}</p>
            <p><strong>📚 Ngành:</strong> ${majorName}</p>
            <p><strong>📋 Phương thức:</strong> ${method}</p>
          </div>
          <p>Vui lòng theo dõi thông tin tiếp theo từ nhà trường để hoàn tất thủ tục nhập học.</p>
          <p style="color: #6c757d; font-style: italic;">Chúc mừng và chúc bạn có một hành trình học tập thành công!</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #6c757d;">Email này được gửi tự động từ hệ thống xét tuyển.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Đã gửi email thông báo trúng tuyển cho ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Lỗi gửi email cho ${userEmail}:`, error);
    return { success: false, error: error.message };
  }
}

// --- Hàm gửi email hàng loạt ---
export async function sendBulkAdmissionNotifications(admissionResults) {
  const results = [];
  
  for (const result of admissionResults) {
    const { userEmail, userName, schoolName, majorName, method } = result;
    const emailResult = await sendAdmissionNotification(userEmail, userName, schoolName, majorName, method);
    results.push({
      email: userEmail,
      success: emailResult.success,
      error: emailResult.error || null
    });
    
    // Delay nhỏ để tránh spam
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}


// --- API đăng ký: gửi OTP về email ---
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới (bước 1 - gửi OTP)
 *     tags: [Auth]
 *     description: Tiếp nhận thông tin đăng ký ban đầu của người dùng và gửi mã OTP về email để xác thực.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten
 *               - sdt
 *               - email
 *               - password
 *             properties:
 *               ten:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               sdt:
 *                 type: string
 *                 example: "0905123456"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "nguyenvana@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "matkhau123"
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Đã gửi mã OTP xác nhận đến email của bạn!
 *       400:
 *         description: Lỗi validation (thiếu thông tin, SĐT/email không hợp lệ, SĐT/email đã tồn tại).
 *       500:
 *         description: Lỗi gửi OTP!
 */
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { ten, sdt, email, password } = req.body;
    const otp = crypto.randomInt(100000, 999999);
    otpStorage[email] = {
      ten, sdt, email, password, otp,
      expires: Date.now() + 5 * 60 * 1000 // OTP hết hạn sau 5 phút
    };

    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Xác nhận đăng ký tài khoản',
      html: `<p>Xin chào <b>${ten}</b>, mã OTP của bạn là: <b>${otp}</b> (hết hạn sau 5 phút).</p>`
    });

    res.status(200).json({ message: 'Đã gửi mã OTP xác nhận đến email của bạn!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi gửi OTP!', error: error.message });
  }
});

// --- API xác thực OTP và tạo tài khoản ---
/**
 * @swagger
 * /api/auth/verify-registration:
 *   post:
 *     summary: Xác thực OTP và hoàn tất đăng ký (bước 2)
 *     tags: [Auth]
 *     description: Xác thực mã OTP người dùng nhập và tạo tài khoản nếu OTP hợp lệ.
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
 *                 example: "nguyenvana@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Đăng ký tài khoản thành công!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *                   description: ID của người dùng mới được tạo.
 *                 token:
 *                   type: string
 *                   description: Token xác thực (hiện tại là userId).
 *       400:
 *         description: Không tìm thấy thông tin đăng ký, OTP không hợp lệ hoặc đã hết hạn.
 *       500:
 *         description: Lỗi xác thực đăng ký!
 */
router.post('/verify-registration', validateEmail, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const registrationData = otpStorage[email];
    if (!registrationData) {
      return res.status(400).json({ message: 'Không tìm thấy thông tin đăng ký hoặc mã OTP đã hết hạn!' });
    }
    if (registrationData.otp !== parseInt(otp) || Date.now() > registrationData.expires) {
      return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn!' });
    }
    const { ten, sdt, password } = registrationData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Lưu user vào MongoDB
    const newUser = new User({
      ten, 
      sdt, 
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    delete otpStorage[email];
    
    res.status(201).json({ 
      message: 'Đăng ký tài khoản thành công!', 
      userId: newUser._id,
      token: newUser._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xác thực đăng ký!', error: error.message });
  }
});

// --- API đăng nhập ---
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Auth]
 *     description: Xác thực thông tin đăng nhập (số điện thoại và mật khẩu) của người dùng.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sdt
 *               - password
 *             properties:
 *               sdt:
 *                 type: string
 *                 example: "0905123456"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "matkhau123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     ten:
 *                       type: string
 *                     sdt:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     schoolId:
 *                       type: string
 *                     school:
 *                       type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Thiếu thông tin SĐT hoặc mật khẩu.
 *       401:
 *         description: Số điện thoại hoặc mật khẩu không chính xác.
 *       500:
 *         description: Lỗi đăng nhập!
 */
router.post('/login', async (req, res) => {
  try {
    const { sdt, password } = req.body;
    if (!sdt || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập số điện thoại và mật khẩu!' });
    }
    
    const user = await User.findOne({ sdt });
    if (!user) {
      return res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không chính xác!' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không chính xác!' });
    }

    // Lấy thông tin trường nếu là admin trường
    let schoolInfo = null;
    if (user.role === 'schoolAdmin' && user.schoolId) {
      const school = await School.findOne({ id: user.schoolId });
      if (school) {
        schoolInfo = {
          id: school.id,
          name: school.name
        };
      }
    }
    
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      user: { 
        id: user._id, 
        ten: user.ten, 
        sdt: user.sdt, 
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        school: schoolInfo
      },
      token: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng nhập!', error: error.message });
  }
});

// --- API kiểm tra trạng thái đăng nhập ---
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [] 
 *     description: Trả về thông tin của người dùng đã đăng nhập (dựa trên token).
 *     responses:
 *       200:
 *         description: Thông tin người dùng.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     ten:
 *                       type: string
 *                     sdt:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ.
 *       404:
 *         description: Không tìm thấy thông tin người dùng.
 *       500:
 *         description: Lỗi lấy thông tin người dùng.
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
    }
    
    res.status(200).json({
      user: { id: user._id, ten: user.ten, sdt: user.sdt, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy thông tin người dùng', error: error.message });
  }
});

// --- API gửi thông báo trúng tuyển cho một người ---
/**
 * @swagger
 * /api/auth/send-admission-notification:
 *   post:
 *     summary: Gửi email thông báo trúng tuyển cho một thí sinh
 *     tags: [Auth, Notifications]
 *     description: Gửi email thông báo kết quả trúng tuyển đến một địa chỉ email cụ thể.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *               - userName
 *               - schoolName
 *               - majorName
 *               - method
 *             properties:
 *               userEmail:
 *                 type: string
 *                 format: email
 *               userName:
 *                 type: string
 *               schoolName:
 *                 type: string
 *               majorName:
 *                 type: string
 *               method:
 *                 type: string
 *                 description: Tên phương thức xét tuyển.
 *     responses:
 *       200:
 *         description: Đã gửi thông báo trúng tuyển thành công!
 *       400:
 *         description: Thiếu thông tin bắt buộc.
 *       500:
 *         description: Lỗi gửi email hoặc lỗi server.
 */
router.post('/send-admission-notification', async (req, res) => {
  try {
    const { userEmail, userName, schoolName, majorName, method } = req.body;
    
    if (!userEmail || !userName || !schoolName || !majorName || !method) {
      return res.status(400).json({ 
        message: 'Thiếu thông tin bắt buộc: userEmail, userName, schoolName, majorName, method' 
      });
    }
    
    const result = await sendAdmissionNotification(userEmail, userName, schoolName, majorName, method);
    
    if (result.success) {
      res.status(200).json({ message: 'Đã gửi thông báo trúng tuyển thành công!' });
    } else {
      res.status(500).json({ message: 'Lỗi gửi email', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// --- API gửi thông báo trúng tuyển hàng loạt ---
/**
 * @swagger
 * /api/auth/send-bulk-admission-notifications:
 *   post:
 *     summary: Gửi email thông báo trúng tuyển hàng loạt
 *     tags: [Auth, Notifications]
 *     description: Gửi email thông báo kết quả trúng tuyển cho một danh sách các thí sinh.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admissionResults:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - userEmail
 *                     - userName
 *                     - schoolName
 *                     - majorName
 *                     - method
 *                   properties:
 *                     userEmail:
 *                       type: string
 *                       format: email
 *                     userName:
 *                       type: string
 *                     schoolName:
 *                       type: string
 *                     majorName:
 *                       type: string
 *                     method:
 *                       type: string
 *     responses:
 *       200:
 *         description: Thông báo về kết quả gửi email hàng loạt.
 *       400:
 *         description: Dữ liệu admissionResults không phải là một mảng.
 *       500:
 *         description: Lỗi server.
 */
router.post('/send-bulk-admission-notifications', async (req, res) => {
  try {
    const { admissionResults } = req.body;
    
    if (!admissionResults || !Array.isArray(admissionResults)) {
      return res.status(400).json({ 
        message: 'Dữ liệu admissionResults phải là một mảng' 
      });
    }
    
    const results = await sendBulkAdmissionNotifications(admissionResults);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    res.status(200).json({
      message: `Đã gửi thông báo: ${successCount} thành công, ${failCount} thất bại`,
      results,
      summary: {
        total: results.length,
        success: successCount,
        failed: failCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});


export { router };
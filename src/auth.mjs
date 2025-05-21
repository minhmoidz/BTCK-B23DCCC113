// auth.mjs
import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

const dataDir = path.resolve('data');
const usersPath = path.join(dataDir, 'users.json');

// --- Cấu hình tài khoản Gmail để gửi mail (nhập trực tiếp, không dùng .env) ---
const EMAIL_USER = 'minhtuantran210305@gmail.com';          // Thay bằng email thật của bạn
const EMAIL_PASS = 'akix ieej zluq gadj';        // Thay bằng App Password Gmail (16 ký tự)

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

// --- Đảm bảo file users.json tồn tại ---
async function ensureFile(filePath, defaultContent = '[]') {
  try {
    await fs.access(dataDir).catch(() => fs.mkdir(dataDir, { recursive: true }));
    await fs.access(filePath).catch(() => fs.writeFile(filePath, defaultContent, 'utf-8'));
  } catch (err) {
    console.error('Lỗi tạo file/thư mục:', err);
  }
}

// --- Đọc danh sách người dùng ---
async function readUsers() {
  await ensureFile(usersPath);
  const data = await fs.readFile(usersPath, 'utf-8');
  return JSON.parse(data);
}

// --- Ghi danh sách người dùng ---
async function writeUsers(users) {
  await ensureFile(usersPath);
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');
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
  const users = await readUsers();
  if (users.find(u => u.sdt === sdt)) {
    return res.status(400).json({ message: 'Số điện thoại đã được đăng ký!' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email đã được đăng ký!' });
  }
  next();
}

// --- API đăng ký: gửi OTP về email ---
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
    const users = await readUsers();
    const newUser = {
      id: crypto.randomUUID(),
      ten, sdt, email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    await writeUsers(users);
    delete otpStorage[email];
    res.status(201).json({ message: 'Đăng ký tài khoản thành công!', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xác thực đăng ký!', error: error.message });
  }
});

// --- API đăng nhập ---
router.post('/login', async (req, res) => {
  try {
    const { sdt, password } = req.body;
    if (!sdt || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập số điện thoại và mật khẩu!' });
    }
    const users = await readUsers();
    const user = users.find(u => u.sdt === sdt);
    if (!user) {
      return res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không chính xác!' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không chính xác!' });
    }
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      user: { id: user.id, ten: user.ten, sdt: user.sdt, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng nhập!', error: error.message });
  }
});

export default router;

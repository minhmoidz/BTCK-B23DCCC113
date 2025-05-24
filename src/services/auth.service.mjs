import User from '../models/User.mjs';
import OTP from '../models/OTP.mjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../config/mailer.mjs';
import crypto from 'crypto'; // Để tạo OTP ngẫu nhiên

// Hàm tạo mã OTP ngẫu nhiên (6 chữ số)
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Hàm MỚI: Yêu cầu OTP để đăng ký
export const requestRegistrationOtpService = async (email) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email này đã được sử dụng để đăng ký tài khoản.');
      error.statusCode = 409; // Conflict
      throw error;
    }

    const otpCode = generateOTP();
    await OTP.deleteMany({ email }); // Xóa OTP cũ (nếu có cho email này, dù mục đích khác)
    const newOtpEntry = new OTP({ email, otp: otpCode });
    await newOtpEntry.save();

    await sendOtpEmail(email, otpCode); // Gửi OTP

    return { message: 'Mã OTP để đăng ký đã được gửi đến email của bạn.' };
  } catch (error) {
    console.error("Lỗi trong requestRegistrationOtpService:", error);
    if (error.statusCode || error.message.includes('Không thể gửi email OTP')) {
      throw error;
    }
    const serviceError = new Error('Có lỗi xảy ra khi yêu cầu OTP đăng ký.');
    serviceError.statusCode = 500;
    throw serviceError;
  }
};

// Hàm MỚI: Xác minh OTP và hoàn tất đăng ký
export const verifyOtpAndRegisterService = async (registrationData) => {
  const { email, otp, password, sdt, role } = registrationData;
  try {
    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) {
      const error = new Error('Mã OTP không hợp lệ hoặc đã hết hạn.');
      error.statusCode = 400;
      throw error;
    }

    // Kiểm tra lại phòng trường hợp email đã được đăng ký trong khoảng thời gian ngắn
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await OTP.deleteOne({ _id: otpEntry._id }); // Xóa OTP đã dùng
      const error = new Error('Email này đã được đăng ký sau khi bạn yêu cầu OTP.');
      error.statusCode = 409;
      throw error;
    }

    const newUser = new User({ email, password, sdt, role });
    await newUser.save();
    await OTP.deleteOne({ _id: otpEntry._id }); // Xóa OTP đã dùng

    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Tùy chọn: có thể tạo và trả về JWT token ngay tại đây để tự động đăng nhập
    // const JWT_SECRET = process.env.JWT_SECRET;
    // if (!JWT_SECRET) throw new Error('JWT_SECRET không được cấu hình');
    // const token = jwt.sign({ userId: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
    // return { user: userResponse, token, message: 'Đăng ký thành công và đã đăng nhập.' };

    return { user: userResponse, message: 'Đăng ký tài khoản thành công.' };

  } catch (error) {
    console.error("Lỗi trong verifyOtpAndRegisterService:", error);
    if (error.name === 'ValidationError') {
      const validationError = new Error('Dữ liệu đăng ký không hợp lệ.');
      validationError.statusCode = 400;
      validationError.details = Object.values(error.errors).map(e => e.message);
      throw validationError;
    }
    if (error.statusCode) {
      throw error;
    }
    const serviceError = new Error('Có lỗi xảy ra khi hoàn tất đăng ký.');
    serviceError.statusCode = 500;
    throw serviceError;
  }
};

// Hàm MỚI: Đăng nhập bằng Email và Mật khẩu (để test)
export const loginWithPasswordService = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Email hoặc mật khẩu không chính xác.'); // Thông báo chung chung
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Email hoặc mật khẩu không chính xác.');
      error.statusCode = 401;
      throw error;
    }

    // Tạo JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('Lỗi: JWT_SECRET chưa được định nghĩa trong biến môi trường.');
      const error = new Error('Lỗi cấu hình server, không thể tạo token.');
      error.statusCode = 500;
      throw error;
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } 
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return { token, user: userResponse, message: 'Đăng nhập thành công.' };

  } catch (error) {
    console.error("Lỗi trong loginWithPasswordService:", error);
    if (error.statusCode) {
        throw error;
    }
    // Lỗi chung khác
    const serviceError = new Error('Có lỗi xảy ra khi đăng nhập bằng mật khẩu.');
    serviceError.statusCode = 500;
    throw serviceError;
  }
};

export const requestLoginOtpService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Email không tồn tại trong hệ thống.');
      error.statusCode = 404;
      throw error;
    }

    // Tạo và lưu OTP mới
    const otpCode = generateOTP();
    await OTP.deleteMany({ email }); // Xóa OTP cũ nếu có
    const newOtpEntry = new OTP({ email, otp: otpCode });
    await newOtpEntry.save();

    // Gửi OTP qua email
    await sendOtpEmail(email, otpCode);

    return { message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và xác nhận.' };

  } catch (error) {
    console.error("Lỗi trong requestLoginOtpService:", error);
    // Nếu lỗi là từ sendOtpEmail hoặc lỗi đã có statusCode
    if (error.message.includes('Không thể gửi email OTP') || error.statusCode) {
        throw error;
    }
    // Lỗi chung khác
    const serviceError = new Error('Có lỗi xảy ra khi yêu cầu OTP.');
    serviceError.statusCode = 500;
    throw serviceError;
  }
};

export const verifyOtpAndLoginService = async (email, otp) => {
  try {
    const otpEntry = await OTP.findOne({ email, otp });

    if (!otpEntry) {
      const error = new Error('Mã OTP không hợp lệ hoặc đã hết hạn.');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Trường hợp này hiếm khi xảy ra nếu requestLoginOtpService đã kiểm tra email
      const error = new Error('Không tìm thấy người dùng với email này.');
      error.statusCode = 404;
      throw error;
    }

    // Xóa OTP sau khi đã xác thực thành công
    await OTP.deleteOne({ _id: otpEntry._id });

    // Tạo JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('Lỗi: JWT_SECRET chưa được định nghĩa trong biến môi trường.');
      const error = new Error('Lỗi cấu hình server, không thể tạo token.');
      error.statusCode = 500;
      throw error;
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } 
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return { token, user: userResponse, message: 'Đăng nhập thành công.' };

  } catch (error) {
    console.error("Lỗi trong verifyOtpAndLoginService:", error);
    if (error.statusCode) {
        throw error;
    }
    const serviceError = new Error('Có lỗi xảy ra khi xác thực OTP và đăng nhập.');
    serviceError.statusCode = 500;
    throw serviceError;
  }
}; 
import {
  // registerUserService, // Sẽ được thay thế
  requestRegistrationOtpService,
  verifyOtpAndRegisterService,
  loginWithPasswordService,
  requestLoginOtpService,
  verifyOtpAndLoginService
} from '../services/auth.service.mjs';

// XÓA hoặc BÌNH LUẬN hàm registerUser cũ
/*
export const registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({ message: 'Đăng ký người dùng thành công.', user });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi đăng ký người dùng.';
    const response = { message };
    if (error.details) {
      response.details = error.details;
    }
    console.error("Lỗi khi đăng ký user (controller):", error);
    res.status(statusCode).json(response);
  }
};
*/

// Hàm MỚI: Controller để yêu cầu OTP cho đăng ký
export const requestRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email là bắt buộc để gửi OTP đăng ký.' });
    }
    const result = await requestRegistrationOtpService(email);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi yêu cầu OTP đăng ký.';
    console.error("Lỗi khi yêu cầu OTP đăng ký (controller):", error);
    res.status(statusCode).json({ message });
  }
};

// Hàm MỚI: Controller để xác minh OTP và hoàn tất đăng ký
export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp, password, sdt, role } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP và Mật khẩu là bắt buộc để hoàn tất đăng ký.' });
    }
    const result = await verifyOtpAndRegisterService({ email, otp, password, sdt, role });
    res.status(201).json(result); // Trả về 201 Created
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi hoàn tất đăng ký.';
    const response = { message };
    if (error.details) {
        response.details = error.details;
    }
    console.error("Lỗi khi hoàn tất đăng ký (controller):", error);
    res.status(statusCode).json(response);
  }
};

// Hàm MỚI: Controller để đăng nhập bằng email và mật khẩu (để test)
export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và Mật khẩu là bắt buộc.' });
    }
    const result = await loginWithPasswordService(email, password);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi đăng nhập bằng mật khẩu.';
    console.error("Lỗi khi đăng nhập bằng mật khẩu (controller):", error);
    res.status(statusCode).json({ message });
  }
};

// requestLoginOtp và verifyOtpAndLogin giữ nguyên
export const requestLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email là bắt buộc để gửi OTP.' });
    }
    const result = await requestLoginOtpService(email);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi yêu cầu OTP.';
    console.error("Lỗi khi yêu cầu OTP (controller):", error);
    res.status(statusCode).json({ message });
  }
};

export const verifyOtpAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email và OTP là bắt buộc để đăng nhập.' });
    }
    const result = await verifyOtpAndLoginService(email, otp);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi xác thực OTP và đăng nhập.';
    console.error("Lỗi khi xác thực OTP (controller):", error);
    res.status(statusCode).json({ message });
  }
}; 
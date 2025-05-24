import nodemailer from 'nodemailer';

// Cấu hình transporter cho Nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail', // ví dụ: 'gmail', 'hotmail', ...
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn từ .env
    pass: process.env.EMAIL_PASS    // Mật khẩu email của bạn từ .env
  }
});

export const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Email người gửi từ .env
    to: toEmail,
    subject: 'Mã OTP xác thực tài khoản của bạn',
    text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút.`,
    html: `<p>Mã OTP của bạn là: <strong>${otp}</strong>.</p><p>Mã này sẽ hết hạn sau 5 phút.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email OTP đã được gửi thành công đến:', toEmail);
  } catch (error) {
    console.error('Lỗi khi gửi email OTP:', error);
    throw new Error('Không thể gửi email OTP. Vui lòng thử lại.');
  }
};

export default transporter; 
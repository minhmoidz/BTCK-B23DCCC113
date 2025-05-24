import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '5m', // OTP sẽ tự động xóa sau 5 phút
  },
});

export default mongoose.model('OTP', otpSchema); 
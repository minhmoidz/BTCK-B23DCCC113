import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email không hợp lệ']
  },
  sdt: {
    type: String,
    // Bạn có thể thêm validation cho số điện thoại ở đây nếu cần
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Thêm các trường khác nếu cần, ví dụ: hoTen, ngaySinh, diaChi,...
  // Tuy nhiên, theo yêu cầu ban đầu, chúng ta chỉ tập trung vào các trường cốt lõi cho auth.
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Hash password trước khi lưu
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method để so sánh password đã nhập với password đã hash trong DB
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model('User', userSchema); 
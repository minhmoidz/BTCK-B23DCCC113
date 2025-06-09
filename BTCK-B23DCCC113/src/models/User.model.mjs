import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  sdt: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'school_admin', 'user'],
    default: 'user'
  },
  schoolId: { 
    type: String,
    required: function() {
      return this.role === 'school_admin';
    }
  },
  createdAt: { type: Date, default: Date.now }
});

// Middleware hash password trước khi lưu
userSchema.pre('save', async function(next) {
  // Chỉ hash password nếu nó được thay đổi hoặc là mới
  if (!this.isModified('password')) return next();
  
  try {
    // Tạo salt
    const salt = await bcrypt.genSalt(10);
    // Hash password với salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Thêm method để so sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; 
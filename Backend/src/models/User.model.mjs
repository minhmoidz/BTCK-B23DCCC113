
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  sdt: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'superAdmin', 'schoolAdmin'],
    default: 'user'
  },
  schoolId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User; 

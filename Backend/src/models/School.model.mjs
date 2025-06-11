import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  
  chiTieu: { type: Number, default: 0 }, // Thêm chỉ tiêu
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('School', schoolSchema); 
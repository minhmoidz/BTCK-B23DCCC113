// models/Major.mjs
import mongoose from 'mongoose';

const majorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  schoolId: { type: String, required: true },
  chiTieu: { type: Number, default: 0 }, // Chỉ tiêu riêng cho từng ngành
  phuongThucXetTuyen: {
    type: String,
    enum: ['diem_thi', 'hoc_ba', 'ket_hop'],
    default: 'diem_thi'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Major', majorSchema);

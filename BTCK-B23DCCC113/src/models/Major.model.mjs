// models/Major.model.mjs
import mongoose from 'mongoose';

// Schema cho tổ hợp môn
const subjectCombinationSchema = new mongoose.Schema({
  code: { type: String, required: true }, // Mã tổ hợp (vd: A00, A01, D01)
  name: { type: String }, // Tên tổ hợp (vd: "Toán, Lý, Hóa")
  subjects: [{ type: String, required: true }] // Danh sách các môn trong tổ hợp
}, { _id: false });

// Schema cho điểm trúng tuyển theo năm
const admissionScoreSchema = new mongoose.Schema({
  year: { type: Number, required: true }, // Năm tuyển sinh
  score: { type: Number, required: true }, // Điểm trúng tuyển

}, { _id: false });

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
  // Thêm các trường mới
  subjectCombinations: [subjectCombinationSchema], // Danh sách các tổ hợp môn xét tuyển
  admissionScores: [admissionScoreSchema], // Lịch sử điểm trúng tuyển qua các năm
  createdAt: { type: Date, default: Date.now }
});

// Tạo index cho việc tìm kiếm
majorSchema.index({ id: 1, schoolId: 1 }, { unique: true });
majorSchema.index({ 'admissionScores.year': 1 });

export default mongoose.model('Major', majorSchema);

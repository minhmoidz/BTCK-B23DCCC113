import mongoose from 'mongoose';

const admissionQuotaSchema = new mongoose.Schema({
  schoolId: { type: String, required: true },
  majorId: { type: String, required: true },
  academicYear: { type: Number, required: true, default: new Date().getFullYear() },
  totalQuota: { type: Number, required: true },
  quotaByMethod: {
    thpt: { type: Number, default: 0 }, // Điểm thi THPT
    hsa: { type: Number, default: 0 },  // Học bạ
    tsa: { type: Number, default: 0 },  // Xét tuyển thẳng
    dgnl: { type: Number, default: 0 }, // Đánh giá năng lực
    xthb: { type: Number, default: 0 }  // Xét tuyển kết hợp
  },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Tạo index cho việc tìm kiếm nhanh
admissionQuotaSchema.index({ schoolId: 1, majorId: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('AdmissionQuota', admissionQuotaSchema); 
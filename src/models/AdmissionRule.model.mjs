import mongoose from 'mongoose';

const admissionRuleSchema = new mongoose.Schema({
  schoolId: { type: String, required: true },
  majorId: { type: String, required: true },
  academicYear: { type: Number, required: true, default: new Date().getFullYear() },
  
  // Quy tắc xét tuyển theo phương thức
  methods: {
    thpt: {
      minScore: { type: Number, default: 0 },
      additionalCriteria: { type: Map, of: String },
      formula: { type: String, default: "diemTongCong + diemUuTien" }
    },
    hsa: {
      minScore: { type: Number, default: 0 },
      additionalCriteria: { type: Map, of: String },
      formula: { type: String, default: "diemTBLop12 * 0.7 + diemTBMonHoc * 0.3" }
    },
    tsa: {
      criteria: { type: Map, of: String },
      priorityOrder: [String]
    },
    dgnl: {
      minScore: { type: Number, default: 0 },
      additionalCriteria: { type: Map, of: String }
    },
    xthb: {
      formula: { type: String, default: "diemTBHocTap * 0.6 + diemNangKhieu * 0.4" },
      minScore: { type: Number, default: 0 }
    }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

admissionRuleSchema.index({ schoolId: 1, majorId: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('AdmissionRule', admissionRuleSchema); 
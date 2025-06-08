import mongoose from 'mongoose';

const admissionRuleSchema = new mongoose.Schema({
  schoolId: { type: String, required: true },
  majorId: { type: String, required: true },
  academicYear: { type: Number, required: true, default: new Date().getFullYear() },
  
  methods: {
    thpt: {
      minScore: { type: Number, default: 0 },
      formula: { type: String, default: "diemTongCong + diemUuTien" },
      additionalCriteria: { type: Map, of: String },
      // THÊM MỚI: Hệ số cho từng môn
      subjectWeights: {
        toan: { type: Number, default: 1 },
        van: { type: Number, default: 1 },
        ly: { type: Number, default: 1 },
        hoa: { type: Number, default: 1 },
        sinh: { type: Number, default: 1 },
        su: { type: Number, default: 1 },
        dia: { type: Number, default: 1 },
        anhVan: { type: Number, default: 1 }
      },
      // THÊM MỚI: Môn bắt buộc
      requiredSubjects: [{
        subject: String,
        minScore: Number
      }]
    },
    hsa: {
      minScore: { type: Number, default: 0 },
      formula: { type: String, default: "diemTBLop12 * 0.7 + diemTBMonHoc * 0.3" },
      additionalCriteria: { type: Map, of: String },
      // THÊM MỚI: Ưu tiên môn theo ngành
      prioritySubjects: [{
        subject: String,
        weight: { type: Number, default: 1 },
        description: String
      }],
      // THÊM MỚI: Hệ số theo lớp
      gradeWeights: {
        lop10: { type: Number, default: 0.2 },
        lop11: { type: Number, default: 0.3 },
        lop12: { type: Number, default: 0.5 }
      }
    },
    tsa: {
      criteria: { type: Map, of: String },
      priorityOrder: [String],
      // THÊM MỚI: Điểm thưởng thành tích
      achievementBonus: [{
        type: String,
        subject: String,
        bonus: Number
      }]
    },
    dgnl: {
      minScore: { type: Number, default: 0 },
      additionalCriteria: { type: Map, of: String },
      // THÊM MỚI: Trọng số các phần thi
      sectionWeights: {
        toanHoc: { type: Number, default: 1 },
        ngonNgu: { type: Number, default: 1 },
        khoaHoc: { type: Number, default: 1 },
        xaHoi: { type: Number, default: 1 }
      }
    },
    xthb: {
      formula: { type: String, default: "diemTBHocTap * 0.6 + diemNangKhieu * 0.4" },
      minScore: { type: Number, default: 0 },
      // THÊM MỚI: Tỷ lệ tổng hợp
      compositeWeights: {
        hocTap: { type: Number, default: 0.6 },
        nangKhieu: { type: Number, default: 0.2 },
        thanhTich: { type: Number, default: 0.2 }
      }
    }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


export default mongoose.model('AdmissionRule', admissionRuleSchema); 
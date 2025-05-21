import mongoose from 'mongoose';

const donXetTuyenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  hoTen: {
    type: String,
    required: true
  },
  sdt: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  ngaySinh: {
    type: Date,
    required: true
  },
  trangThai: {
    type: String,
    enum: ['dang_duyet', 'da_duyet', 'bi_tu_choi', 'can_bo_sung', 'da_rut'],
    default: 'dang_duyet'
  },
  truongId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CacTruong',
    required: true
  },
  nganhId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nganh',
    required: true
  },
  phuongThucXetTuyen: {
    type: String,
    enum: ['diem_thi', 'hoc_ba', 'tsa'],
    required: true
  },
  toHopXetTuyen: {
    type: String,
     // Sẽ được yêu cầu có điều kiện bên dưới hoặc xử lý ở tầng service/controller
    required: function() {
      return this.phuongThucXetTuyen === 'diem_thi';
    }
  },
  diemThi: {
    type: Number,
    required: function() {
      return this.phuongThucXetTuyen === 'diem_thi' || this.phuongThucXetTuyen === 'tsa';
    }
  },
  diemHocBa: {
    type: Number,
    required: function() {
      return this.phuongThucXetTuyen === 'hoc_ba';
    }
  },
  doiTuongUuTien: {
    type: String,
    enum: ['Khu vực 1', 'Khu vực 2', 'Khu vực 2 nông thôn ', 'Khu vực 3'],
    required: true
  },
  minhChung: [{
    tenFile: String,
    duongDan: String,
    loaiFile: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
// Middleware để cập nhật updatedAt
donXetTuyenSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
// Middleware để kiểm tra minh chứng bắt buộc cho học bạ
donXetTuyenSchema.pre('validate', function(next) {
  if (this.phuongThucXetTuyen === 'hoc_ba') {
    if (!this.minhChung || this.minhChung.length === 0) {
      this.invalidate('minhChung', 'Minh chứng là bắt buộc cho phương thức xét tuyển học bạ.', this.minhChung);
    }
    // Nếu cần kiểm tra "có xác nhận của trường" cho từng file minh chứng học bạ
    // thì bạn cần thêm 1 trường trong `minhChung` array, ví dụ `xacNhanTruong: Boolean`
    // và kiểm tra ở đây hoặc lúc hiển thị/upload.
    // Hiện tại, "có xác nhận của trường" được hiểu là nội dung của file minh chứng (vd: học bạ có dấu đỏ).
  }
  next();
});

export default mongoose.model('DonXetTuyen', donXetTuyenSchema); 
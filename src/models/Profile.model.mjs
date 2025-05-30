import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  
  userId: { type: String, required: true },
  maHoSo: { type: String, required: true, unique: true },
  phuongThuc: { type: String, required: true },
  tenPhuongThuc: { type: String, required: true },
  
  dotXetTuyen: { type: Number },
  ngayXetTuyen: { type: Date },
  ngayXacNhanNhapHoc: { type: Date },
  


  // Thông tin cá nhân
  hoTen: { type: String, required: true },
  ngaySinh: { type: String, required: true },
  gioiTinh: { type: String },
  danToc: { type: String },
  soCCCD: { type: String, required: true },
  ngayCapCCCD: { type: String },
  noiCapCCCD: { type: String },
  
  // Thông tin liên hệ
  diaChiThuongTru: { type: String, required: true },
  diaChiLienHe: { type: String },
  email: { type: String, required: true },
  soDienThoai: { type: String, required: true },
  soDienThoaiPhuHuynh: { type: String },
  
  // Thông tin học tập
  truongTHPT: { type: String, required: true },
  maTruongTHPT: { type: String },
  tinhThanhTHPT: { type: String },
  namTotNghiep: { type: String, required: true },
  
  // Thông tin xét tuyển
  truong: { type: String, required: true },
  maTruong: { type: String },
  nganh: { type: String, required: true },
  maNganh: { type: String },
  
  // Dữ liệu riêng theo phương thức
  // THPT
  toHop: { type: String },
  maToHop: { type: String },
  monThi: [{ ten: String, diem: Number }],
  diemTongCong: { type: Number },
  diemUuTien: { type: Number },
  diemXetTuyen: { type: Number },
  doiTuongUuTien: { type: String },
  khuVucUuTien: { type: String },
  
  // HSA
  diemTBLop11: { type: Number },
  diemTBLop12: { type: Number },
  diemTBMonHoc: { type: Number },
  monHoc: [{ mon: String, diem: Number }],
  
  // TSA
  loaiGiaiThuong: { type: String },
  capGiaiThuong: { type: String },
  tenGiaiThuong: { type: String },
  namDoatGiai: { type: String },
  
  // DGNL
  diemDanhGiaNangLuc: { type: Number },
  ngayThi: { type: String },
  noiThi: { type: String },
  soBaoDanh: { type: String },
  
  // XTHB
  diemTBHocTap: { type: Number },
  diemNangKhieu: { type: Number },
  loaiNangKhieu: { type: String },
  diemPhongVan: { type: Number },
  ngayPhongVan: { type: String },
  
  // Thông tin bổ sung
  nguyenVong: { type: Number, default: 1 },
  ghiChu: { type: String },
  
  // Thông tin file
  files: [{ type: String }],
  fileCategories: { type: Map, of: String },
  
  // Trạng thái hồ sơ
  trangThai: { type: String, default: 'dang_duyet' },
  lichSuTrangThai: [{
    trangThai: { type: String },
    thoiGian: { type: Date },
    ghiChu: { type: String }
  }],
  
  // Thời gian
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }


  
});



const Profile = mongoose.model('Profile', profileSchema);

export default Profile; 
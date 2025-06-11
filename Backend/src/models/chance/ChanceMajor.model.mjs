import mongoose from 'mongoose';

// Schema cho tổ hợp môn
const subjectCombinationSchema = new mongoose.Schema({
  code: { type: String, required: true }, // Mã tổ hợp, ví dụ: "A00", "A01"
  subjects: [{ type: String, required: true }] // Danh sách các môn trong tổ hợp, ví dụ: ["Toán", "Lí", "Hóa"]
}, { _id: false }); // Không tạo _id riêng cho sub-document này

const chanceMajorSchema = new mongoose.Schema({
  schoolId: { type: String, required: true, ref: 'ChanceSchool' }, // ID của trường (tham chiếu đến ChanceSchool)
  sequenceNumber: { type: Number, required: true }, // Số thứ tự của ngành trong trường
  majorCode: { type: String, required: true }, // Mã ngành
  name: { type: String, required: true }, // Tên ngành
  subjectCombinations: [subjectCombinationSchema], // Danh sách các tổ hợp môn xét tuyển
  benchmarkThpt: { type: Number }, // Điểm chuẩn xét theo điểm thi THPT
  benchmarkDgnlHn30: { type: Number }, // Điểm chuẩn ĐGNL Đại học Quốc Gia Hà Nội (thang 30)
  benchmarkDgnlHcm30: { type: Number }, // Điểm chuẩn ĐGNL Đại học Quốc Gia TPHCM (thang 30)
  benchmarkDgnlHn150: { type: Number }, // Điểm chuẩn ĐGNL Đại học Quốc Gia Hà Nội (thang 150)
  benchmarkDgnlHcm150: { type: Number }, // Điểm chuẩn ĐGNL Đại học Quốc Gia TPHCM (thang 150)
  benchmarkDgtd: { type: Number }, // Điểm chuẩn Đánh giá tư duy (ví dụ: Đại học Bách Khoa HN)
  multipliedSubject: { type: String }, // Tên môn học được nhân hệ số 2 (ví dụ: "Toán")
  createdAt: { type: Date, default: Date.now }, // Ngày tạo
  updatedAt: { type: Date, default: Date.now } // Ngày cập nhật
});

// Đánh index để tìm kiếm và đảm bảo tính duy nhất
chanceMajorSchema.index({ schoolId: 1, majorCode: 1 }, { unique: true });
chanceMajorSchema.index({ schoolId: 1 });

export default mongoose.model('ChanceMajor', chanceMajorSchema); 
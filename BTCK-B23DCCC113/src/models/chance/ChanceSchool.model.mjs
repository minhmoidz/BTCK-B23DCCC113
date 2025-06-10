import mongoose from 'mongoose';

const chanceSchoolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Mã trường duy nhất, ví dụ: "HUST", "VNU"
  name: { type: String, required: true }, // Tên đầy đủ của trường, ví dụ: "Đại học Bách Khoa Hà Nội"
  createdAt: { type: Date, default: Date.now }, // Ngày tạo
  updatedAt: { type: Date, default: Date.now } // Ngày cập nhật
});

export default mongoose.model('ChanceSchool', chanceSchoolSchema); 
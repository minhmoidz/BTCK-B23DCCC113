import mongoose from 'mongoose';

const subjectBlockSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Mã khối, ví dụ: "A00", "D01"
  name: { type: String }, // Tên khối (có thể tự động tạo từ các môn học hoặc nhập thủ công)
  subjects: [{ type: String, required: true }], // Danh sách các môn học trong khối, ví dụ: ["Toán", "Vật lí", "Hóa học"]
  createdAt: { type: Date, default: Date.now }, // Ngày tạo
  updatedAt: { type: Date, default: Date.now }  // Ngày cập nhật
});

// Middleware để tự động tạo tên khối nếu không được cung cấp
subjectBlockSchema.pre('save', function(next) {
  if (!this.name && this.subjects && this.subjects.length > 0) {
    this.name = this.subjects.join(', ');
  }
  next();
});

subjectBlockSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.$set && !update.$set.name && update.$set.subjects && update.$set.subjects.length > 0) {
    update.$set.name = update.$set.subjects.join(', ');
  } else if (!update.name && update.subjects && update.subjects.length > 0) { // Handle case where entire document is set
     update.name = update.subjects.join(', ');
  }
  next();
});

export default mongoose.model('SubjectBlock', subjectBlockSchema); 
// models/SubjectGroup.mjs
import mongoose from 'mongoose';

const subjectGroupSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  schoolId: { type: String, required: true },
  majorId: { type: String, required: true },
  methods: [String], // Các phương thức xét tuyển sử dụng tổ hợp này
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

subjectGroupSchema.index({ id: 1, schoolId: 1, majorId: 1 }, { unique: true });
export default mongoose.model('SubjectGroup', subjectGroupSchema);

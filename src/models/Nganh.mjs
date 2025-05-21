import mongoose from 'mongoose';

const nganhSchema = new mongoose.Schema({
  tenNganh: {
    type: String,
    required: true
  },
  maNganh: {
    type: String,
    required: true,
    unique: true
  },
  truongId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CacTruong',
    required: true
  },
  phuongThucXetTuyen: [{
    type: String,
    enum: ['diem_thi', 'hoc_ba', 'tsa']
  }],
  toHopXetTuyen: [{
    type: String
  }],
  chiTieu: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
nganhSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Nganh', nganhSchema); 
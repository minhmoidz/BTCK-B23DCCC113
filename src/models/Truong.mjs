import mongoose from 'mongoose';

const truongSchema = new mongoose.Schema({
  tenTruong: {
    type: String,
    required: true
  },
  maTruong: {
    type: String,
    required: true,
    unique: true
  },
  diaChi: {
    type: String,
    required: true
  },
  website: {
    type: String,
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
},{
});

export default mongoose.model('CacTruong', truongSchema); 
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    profileId: { type: String, required: true },
    userId: { type: String, required: true },
    type: { type: String, enum: ['trung_tuyen', 'khong_trung_tuyen'], required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    sentAt: { type: Date },
    method: { type: String, enum: ['email', 'sms', 'both'], default: 'email' },
    createdAt: { type: Date, default: Date.now }
  });

export default mongoose.model('Notification', notificationSchema); 
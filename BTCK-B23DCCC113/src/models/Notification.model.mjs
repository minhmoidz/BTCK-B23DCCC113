import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin who created the notification
    type: { 
        type: String, 
        enum: ['normal', 'urgent', 'announcement'], 
        default: 'normal'
    },
    isPinned: { type: Boolean, default: false },
    scheduledFor: { type: Date }, // For scheduled notifications
    publishedAt: { type: Date }, // When the notification was actually published
    expiresAt: { type: Date }, // Optional expiration date
    status: { 
        type: String, 
        enum: ['draft', 'scheduled', 'published', 'expired'], 
        default: 'draft'
    },
    visibility: {
        type: String,
        enum: ['all_users', 'specific_users', 'roles'],
        default: 'all_users'
    },
    targetAudience: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }], // For specific users or roles
    targetRoles: [{
        type: String,
        enum: ['student', 'parent', 'school']
    }],
    readBy: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now }
    }],
    metadata: {
        priority: { type: Number, default: 0 }, // Higher number = higher priority
        category: { type: String },
        tags: [String]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
notificationSchema.index({ status: 1, scheduledFor: 1 });
notificationSchema.index({ isPinned: 1, publishedAt: -1 });
notificationSchema.index({ 'readBy.user': 1 });

// Pre-save middleware to update the updatedAt field
notificationSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model('Notification', notificationSchema); 
import Notification from '../models/Notification.mjs';
import fs from 'fs';
import path from 'path';

// Tạo thông báo mới
export const createNotification = async (req, res) => {
  try {
    const { title, content, description, isImportant, isPinned } = req.body;
    let imagePath = null;

    // Handle image upload if exists
    if (req.file) {
      const uploadDir = 'uploads/notifications';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Move file from tmp to permanent location
      const newPath = path.join(uploadDir, req.file.filename);
      fs.renameSync(req.file.path, newPath);
      imagePath = `${uploadDir}/${req.file.filename}`;
    }
    
    const notification = new Notification({
      title,
      content,
      description,
      image: imagePath,
      isImportant: isImportant === 'true',
      isPinned: isPinned === 'true'
    });

    await notification.save();
    
    res.status(201).json({
      success: true,
      message: 'Thông báo đã được tạo thành công',
      data: notification
    });
  } catch (error) {
    // Clean up uploaded file if there was an error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({
      success: false,
      message: 'Không thể tạo thông báo',
      error: error.message
    });
  }
};

// Lấy danh sách tất cả thông báo
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ 
        isImportant: -1, // Quan trọng lên đầu tiên
        isPinned: -1, // Ghim thứ hai
        createdAt: -1 // Mới nhất lên trên
      });
    
    // Lấy thống kê
    const total = await Notification.countDocuments();
    const pinned = await Notification.countDocuments({ isPinned: true });
    const important = await Notification.countDocuments({ isImportant: true });
    
    res.status(200).json({
      success: true,
      stats: { total, pinned, important },
      data: notifications
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể lấy danh sách thông báo',
      error: error.message
    });
  }
};

// Lấy chi tiết một thông báo
export const getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể lấy thông tin thông báo',
      error: error.message
    });
  }
};

// Cập nhật trạng thái ghim
export const togglePin = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    notification.isPinned = !notification.isPinned;
    await notification.save();

    res.status(200).json({
      success: true,
      message: notification.isPinned ? 'Đã ghim thông báo' : 'Đã bỏ ghim thông báo',
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể thay đổi trạng thái ghim',
      error: error.message
    });
  }
};

// Cập nhật trạng thái quan trọng
export const toggleImportant = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    notification.isImportant = !notification.isImportant;
    await notification.save();

    res.status(200).json({
      success: true,
      message: notification.isImportant ? 'Đã đánh dấu là thông báo quan trọng' : 'Đã bỏ đánh dấu thông báo quan trọng',
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể thay đổi trạng thái quan trọng',
      error: error.message
    });
  }
};

// Cập nhật thông báo
export const updateNotification = async (req, res) => {
  try {
    const { title, content, description, isImportant, isPinned } = req.body;
    let updateData = { title, content, description, isImportant: isImportant === 'true', isPinned: isPinned === 'true' };

    // Handle image upload if exists
    if (req.file) {
      const uploadDir = 'uploads/notifications';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Move file from tmp to permanent location
      const newPath = path.join(uploadDir, req.file.filename);
      fs.renameSync(req.file.path, newPath);
      updateData.image = `${uploadDir}/${req.file.filename}`;

      // Delete old image if exists
      const oldNotification = await Notification.findById(req.params.id);
      if (oldNotification && oldNotification.image) {
        try {
          fs.unlinkSync(oldNotification.image);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
    }

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thông báo thành công',
      data: notification
    });
  } catch (error) {
    // Clean up uploaded file if there was an error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({
      success: false,
      message: 'Không thể cập nhật thông báo',
      error: error.message
    });
  }
};

// Xóa thông báo
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    // Delete associated image if exists
    if (notification.image) {
      try {
        fs.unlinkSync(notification.image);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    await notification.deleteOne();

    res.json({
      success: true,
      message: 'Xóa thông báo thành công'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể xóa thông báo',
      error: error.message
    });
  }
}; 
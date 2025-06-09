import Notification from '../models/Notification.mjs';

// Tạo thông báo mới
export const createNotification = async (req, res) => {
  try {
    const { title, content, description, isImportant, isPinned } = req.body;
    
    const notification = new Notification({
      title,
      content,
      description,
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
    
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        description,
        isImportant: isImportant === 'true',
        isPinned: isPinned === 'true',
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Thông báo đã được cập nhật thành công',
      data: notification
    });
  } catch (error) {
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
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đã xóa thông báo thành công'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể xóa thông báo',
      error: error.message
    });
  }
}; 
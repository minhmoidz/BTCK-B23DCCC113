import Profile from '../models/Profile.model.mjs';
import Notification from '../models/Notification.model.mjs';
// import Notification from '../models/Notification.model.mjs'; // Giả định createNotification sẽ ở đây hoặc service riêng

export async function sendAdmissionResults(schoolId, majorId, academicYear) {
    try {
      // Lấy danh sách hồ sơ trúng tuyển
      const acceptedProfiles = await Profile.find({
        truong: schoolId,
        maNganh: majorId,
        trangThai: 'trung_tuyen'
      });
  
      // Gửi thông báo trúng tuyển
      for (const profile of acceptedProfiles) {
        // Chức năng gửi thông báo sẽ được triển khai sau
      }
  
      // Gửi thông báo không trúng tuyển
      const rejectedProfiles = await Profile.find({
        truong: schoolId,
        maNganh: majorId,
        trangThai: 'duyet', // Đã duyệt nhưng chưa trúng tuyển
        createdAt: { $gte: new Date(academicYear, 0, 1) }
      });
  
      for (const profile of rejectedProfiles) {
        // Chức năng gửi thông báo sẽ được triển khai sau
      }
  
      return { success: true, message: 'Đã gửi thông báo thành công' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

// Hàm đăng các thông báo đã lên lịch
export const publishScheduledNotifications = async () => {
    try {
        const now = new Date();
        
        // Tìm tất cả thông báo đã lên lịch cần được đăng ngay bây giờ
        const scheduledNotifications = await Notification.find({
            status: 'scheduled',
            scheduledFor: { $lte: now }
        });

        // Cập nhật trạng thái của từng thông báo thành đã đăng
        for (const notification of scheduledNotifications) {
            notification.status = 'published';
            notification.publishedAt = now;
            await notification.save();
        }

        return scheduledNotifications;
    } catch (error) {
        console.error('Lỗi khi đăng thông báo đã lên lịch:', error);
        throw error;
    }
};

// Hàm đánh dấu thông báo đã hết hạn
export const markExpiredNotifications = async () => {
    try {
        const now = new Date();
        
        // Tìm tất cả thông báo đã đăng và đã hết hạn
        const expiredNotifications = await Notification.find({
            status: 'published',
            expiresAt: { $lte: now }
        });

        // Cập nhật trạng thái của từng thông báo thành đã hết hạn
        for (const notification of expiredNotifications) {
            notification.status = 'expired';
            await notification.save();
        }

        return expiredNotifications;
    } catch (error) {
        console.error('Lỗi khi đánh dấu thông báo hết hạn:', error);
        throw error;
    }
};

// Hàm dọn dẹp các thông báo cũ
export const cleanupOldNotifications = async (daysOld = 30) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        // Xóa các thông báo đã hết hạn và cũ hơn ngày giới hạn
        const result = await Notification.deleteMany({
            status: 'expired',
            updatedAt: { $lt: cutoffDate }
        });

        return result;
    } catch (error) {
        console.error('Lỗi khi dọn dẹp thông báo cũ:', error);
        throw error;
    }
}; 
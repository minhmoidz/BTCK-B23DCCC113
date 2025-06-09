import Profile from '../models/Profile.model.mjs';
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
        // await createNotification({
        //   profileId: profile._id,
        //   userId: profile.userId,
        //   type: 'trung_tuyen',
        //   title: 'Chúc mừng! Bạn đã trúng tuyển',
        //   content: `Chúc mừng ${profile.hoTen} đã trúng tuyển ngành ${profile.nganh} tại ${profile.truong} qua phương thức ${profile.phuongThuc}.`,
        //   method: 'both'
        // });
      }
  
      // Gửi thông báo không trúng tuyển
      const rejectedProfiles = await Profile.find({
        truong: schoolId,
        maNganh: majorId,
        trangThai: 'duyet', // Đã duyệt nhưng chưa trúng tuyển
        createdAt: { $gte: new Date(academicYear, 0, 1) }
      });
  
      for (const profile of rejectedProfiles) {
        // await createNotification({
        //   profileId: profile._id,
        //   userId: profile.userId,
        //   type: 'khong_trung_tuyen',
        //   title: 'Thông báo kết quả xét tuyển',
        //   content: `Rất tiếc, hồ sơ của ${profile.hoTen} chưa đủ điều kiện trúng tuyển ngành ${profile.nganh}.`,
        //   method: 'email'
        // });
      }
  
      return { success: true, message: 'Đã gửi thông báo thành công' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  } 
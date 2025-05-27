import express from 'express';
import User from '../../models/User.mjs';
import Profile from '../../models/Profile.mjs';
import School from '../../models/School.mjs';

const router = express.Router();

// API thống kê tổng quan
router.get('/tong-quan', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    
    const profilesByStatus = await Profile.aggregate([
      {
        $group: {
          _id: '$trangThai',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    res.json({
      tongSoUser: totalUsers,
      userDangKyTuan: recentUsers,
      tongSoHoSo: totalProfiles,
      thongKeTheoTrangThai: profilesByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
    
  } catch (error) {
    console.error('Lỗi thống kê tổng quan:', error);
    res.status(500).json({ error: error.message });
  }
});

// API thống kê trường có nhiều người đăng ký nhất
router.get('/truong-pho-bien', async (req, res) => {
  try {
    const schoolStats = await Profile.aggregate([
      {
        $group: {
          _id: '$truong',
          soLuongDangKy: { $sum: 1 }
        }
      },
      {
        $sort: { soLuongDangKy: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    const enrichedStats = await Promise.all(
      schoolStats.map(async (stat) => {
        const school = await School.findOne({ id: stat._id });
        return {
          maTruong: stat._id,
          tenTruong: school?.name || 'Không xác định',
          soLuongDangKy: stat.soLuongDangKy
        };
      })
    );
    
    res.json(enrichedStats);
    
  } catch (error) {
    console.error('Lỗi thống kê trường phổ biến:', error);
    res.status(500).json({ error: error.message });
  }
});

// API thống kê user đăng ký theo thời gian
router.get('/user-theo-thoi-gian', async (req, res) => {
  try {
    const { loai = 'ngay' } = req.query;
    
    let groupBy;
    switch (loai) {
      case 'tuan':
        groupBy = {
          nam: { $year: '$createdAt' },
          tuan: { $week: '$createdAt' }
        };
        break;
      case 'thang':
        groupBy = {
          nam: { $year: '$createdAt' },
          thang: { $month: '$createdAt' }
        };
        break;
      default:
        groupBy = {
          nam: { $year: '$createdAt' },
          thang: { $month: '$createdAt' },
          ngay: { $dayOfMonth: '$createdAt' }
        };
    }
    
    const userStats = await User.aggregate([
      {
        $group: {
          _id: groupBy,
          soLuongDangKy: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.nam': -1, '_id.thang': -1, '_id.ngay': -1 }
      },
      {
        $limit: 30
      }
    ]);
    
    res.json(userStats);
    
  } catch (error) {
    console.error('Lỗi thống kê user theo thời gian:', error);
    res.status(500).json({ error: error.message });
  }
});

// API thống kê hồ sơ nộp theo thời gian
router.get('/ho-so-theo-thoi-gian', async (req, res) => {
  try {
    const { loai = 'ngay' } = req.query;
    
    let groupBy;
    switch (loai) {
      case 'tuan':
        groupBy = {
          nam: { $year: '$ngayNop' },
          tuan: { $week: '$ngayNop' }
        };
        break;
      case 'thang':
        groupBy = {
          nam: { $year: '$ngayNop' },
          thang: { $month: '$ngayNop' }
        };
        break;
      default:
        groupBy = {
          nam: { $year: '$ngayNop' },
          thang: { $month: '$ngayNop' },
          ngay: { $dayOfMonth: '$ngayNop' }
        };
    }
    
    const profileStats = await Profile.aggregate([
      {
        $group: {
          _id: groupBy,
          soLuongNop: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.nam': -1, '_id.thang': -1, '_id.ngay': -1 }
      },
      {
        $limit: 30
      }
    ]);
    
    res.json(profileStats);
    
  } catch (error) {
    console.error('Lỗi thống kê hồ sơ theo thời gian:', error);
    res.status(500).json({ error: error.message });
  }
});

// API so sánh số user đăng ký vs số hồ sơ nộp
router.get('/so-sanh', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const userByMonth = await User.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            nam: { $year: '$createdAt' },
            thang: { $month: '$createdAt' }
          },
          soUser: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.nam': 1, '_id.thang': 1 }
      }
    ]);
    
    const profileByMonth = await Profile.aggregate([
      {
        $match: { ngayNop: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            nam: { $year: '$ngayNop' },
            thang: { $month: '$ngayNop' }
          },
          soHoSo: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.nam': 1, '_id.thang': 1 }
      }
    ]);
    
    res.json({
      userTheoThang: userByMonth,
      hoSoTheoThang: profileByMonth
    });
    
  } catch (error) {
    console.error('Lỗi thống kê so sánh:', error);
    res.status(500).json({ error: error.message });
  }
});

export { router as statisticsRoutes };

import express from 'express';
import { adminAuth } from './middleware/validation.mjs';
import Profile from '../../models/Profile.mjs';
import School from '../../models/School.mjs';
import Major from '../../models/Major.mjs';

const router = express.Router();

// --- API thống kê hồ sơ theo ngành (public) ---
router.get('/statistics/majors', async (req, res) => {
  try {
    const { schoolId } = req.query;
    
    const matchStage = schoolId ? 
      { $match: { truong: schoolId } } : 
      { $match: {} };
    
    const stats = await Profile.aggregate([
      matchStage,
      { $group: { 
        _id: { truong: "$truong", nganh: "$maNganh" }, 
        count: { $sum: 1 },
        daDuyet: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "duyet"] }, 1, 0] }
        },
        dangDuyet: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "dang_duyet"] }, 1, 0] }
        },
        tuChoi: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "tu_choi"] }, 1, 0] }
        },
        trungTuyen: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "trung_tuyen"] }, 1, 0] }
        }
      }},
      { $sort: { "_id.truong": 1, count: -1 } }
    ]);
    
    // Lấy thông tin chi tiết trường và ngành
    const schools = await School.find();
    const schoolMap = {};
    schools.forEach(school => {
      schoolMap[school.id] = school.name;
    });
    
    const majors = await Major.find();
    const majorMap = {};
    majors.forEach(major => {
      majorMap[`${major.schoolId}-${major.id}`] = major.name;
    });
    
    const result = stats.map(item => ({
      schoolId: item._id.truong,
      schoolName: schoolMap[item._id.truong] || item._id.truong,
      majorId: item._id.nganh,
      majorName: majorMap[`${item._id.truong}-${item._id.nganh}`] || item._id.nganh,
      count: item.count,
      daDuyet: item.daDuyet,
      dangDuyet: item.dangDuyet,
      tuChoi: item.tuChoi,
      trungTuyen: item.trungTuyen
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- API thống kê hồ sơ theo trường (admin) ---
router.get('/admin/statistics/schools', adminAuth, async (req, res) => {
  try {
    const stats = await Profile.aggregate([
      { $group: { 
        _id: "$truong", 
        count: { $sum: 1 },
        daDuyet: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "duyet"] }, 1, 0] }
        },
        dangDuyet: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "dang_duyet"] }, 1, 0] }
        },
        tuChoi: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "tu_choi"] }, 1, 0] }
        },
        trungTuyen: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "trung_tuyen"] }, 1, 0] }
        }
      }},
      { $sort: { count: -1 } }
    ]);
    
    const schools = await School.find();
    const schoolMap = {};
    schools.forEach(school => {
      schoolMap[school.id] = school.name;
    });
    
    const result = stats.map(item => ({
      id: item._id,
      name: schoolMap[item._id] || item._id,
      count: item.count,
      daDuyet: item.daDuyet,
      dangDuyet: item.dangDuyet,
      tuChoi: item.tuChoi,
      trungTuyen: item.trungTuyen
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import { isAdmin,sendBulkAdmissionNotifications } from '../auth.mjs';
import School from '../models/School.mjs';
import Major from '../models/Major.mjs';
import SubjectGroup from '../models/SubjectGroup.mjs';
import Profile from '../models/Profile.mjs';
import AdmissionQuota from '../models/loccv/AdmissionQuota.mjs';
import AdmissionRule from '../models/loccv/AdmissionRule.mjs';
import { filterAllProfiles } from '../utils/admissionFilter.mjs';

const router = express.Router();

// Middleware xác thực admin cho tất cả routes
router.use(isAdmin);

// --- API QUẢN LÝ TRƯỜNG HỌC ---

// GET /admin/schools - Lấy danh sách trường
router.get('/schools', async (req, res) => {
  try {
    const schools = await School.find().sort('name');
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /admin/schools - Thêm trường mới
router.post('/schools', async (req, res) => {
  try {
    const { id, name } = req.body;
    const school = new School({ id, name });
    await school.save();
    res.status(201).json(school);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /admin/schools/:id - Cập nhật trường
router.put('/schools/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const school = await School.findOneAndUpdate(
      { id: req.params.id },
      { name, updatedAt: Date.now() },
      { new: true }
    );
    if (!school) return res.status(404).json({ message: 'Trường không tồn tại' });
    res.json(school);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /admin/schools/:id - Xóa trường
router.delete('/schools/:id', async (req, res) => {
  try {
    const school = await School.findOneAndDelete({ id: req.params.id });
    if (!school) return res.status(404).json({ message: 'Trường không tồn tại' });
    
    // Xóa các ngành và tổ hợp liên quan
    await Major.deleteMany({ schoolId: req.params.id });
    await SubjectGroup.deleteMany({ schoolId: req.params.id });
    
    res.json({ message: 'Xóa trường thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- API QUẢN LÝ NGÀNH HỌC ---

// GET /admin/majors - Lấy danh sách ngành
router.get('/majors', async (req, res) => {
  try {
    const { schoolId } = req.query;
    const query = schoolId ? { schoolId } : {};
    const majors = await Major.find(query).sort('name');
    res.json(majors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /admin/majors - Thêm ngành mới
router.post('/majors', async (req, res) => {
  try {
    const { id, name, schoolId } = req.body;
    const major = new Major({ id, name, schoolId });
    await major.save();
    res.status(201).json(major);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /admin/majors/:id - Cập nhật ngành
router.put('/majors/:id', async (req, res) => {
  try {
    const { name, schoolId } = req.body;
    const major = await Major.findOneAndUpdate(
      { id: req.params.id, schoolId },
      { name, updatedAt: Date.now() },
      { new: true }
    );
    if (!major) return res.status(404).json({ message: 'Ngành không tồn tại' });
    res.json(major);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /admin/majors/:id - Xóa ngành
router.delete('/majors/:id', async (req, res) => {
  try {
    const { schoolId } = req.query;
    const major = await Major.findOneAndDelete({ id: req.params.id, schoolId });
    if (!major) return res.status(404).json({ message: 'Ngành không tồn tại' });
    
    // Xóa các tổ hợp liên quan
    await SubjectGroup.deleteMany({ majorId: req.params.id, schoolId });
    
    res.json({ message: 'Xóa ngành thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- API QUẢN LÝ TỔ HỢP MÔN ---

// GET /admin/subject-groups - Lấy danh sách tổ hợp môn
router.get('/subject-groups', async (req, res) => {
  try {
    const { schoolId, majorId } = req.query;
    const query = {};
    if (schoolId) query.schoolId = schoolId;
    if (majorId) query.majorId = majorId;
    
    const subjectGroups = await SubjectGroup.find(query).sort('id');
    res.json(subjectGroups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /admin/subject-groups - Thêm tổ hợp môn mới
router.post('/subject-groups', async (req, res) => {
  try {
    const { id, name, schoolId, majorId } = req.body;
    const subjectGroup = new SubjectGroup({ id, name, schoolId, majorId });
    await subjectGroup.save();
    res.status(201).json(subjectGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /admin/subject-groups/:id - Cập nhật tổ hợp môn
router.put('/subject-groups/:id', async (req, res) => {
  try {
    const { name, schoolId, majorId } = req.body;
    const subjectGroup = await SubjectGroup.findOneAndUpdate(
      { id: req.params.id, schoolId, majorId },
      { name, updatedAt: Date.now() },
      { new: true }
    );
    if (!subjectGroup) return res.status(404).json({ message: 'Tổ hợp không tồn tại' });
    res.json(subjectGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /admin/subject-groups/:id - Xóa tổ hợp môn
router.delete('/subject-groups/:id', async (req, res) => {
  try {
    const { schoolId, majorId } = req.query;
    const subjectGroup = await SubjectGroup.findOneAndDelete({ 
      id: req.params.id, 
      schoolId, 
      majorId 
    });
    if (!subjectGroup) return res.status(404).json({ message: 'Tổ hợp không tồn tại' });
    res.json({ message: 'Xóa tổ hợp thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- API THỐNG KÊ HỒ SƠ ---

// GET /admin/statistics/schools - Thống kê hồ sơ theo trường
router.get('/statistics/schools', async (req, res) => {
  try {
    const stats = await Profile.aggregate([
      { $group: { 
        _id: "$truong", 
        count: { $sum: 1 },
        daDuyet: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "da_duyet"] }, 1, 0] }
        },
        dangDuyet: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "dang_duyet"] }, 1, 0] }
        },
        tuChoi: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "tu_choi"] }, 1, 0] }
        }
      }},
      { $sort: { count: -1 } }
    ]);
    
    // Lấy thông tin chi tiết trường
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
      tuChoi: item.tuChoi
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /admin/statistics/majors - Thống kê hồ sơ theo ngành
router.get('/statistics/majors', async (req, res) => {
  try {
    const { schoolId } = req.query;
    
    const matchStage = schoolId ? 
      { $match: { truong: schoolId } } : 
      { $match: {} };
    
    const stats = await Profile.aggregate([
      matchStage,
      { $group: { 
        _id: { truong: "$truong", nganh: "$nganh" }, 
        count: { $sum: 1 },
        daDuyet: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "da_duyet"] }, 1, 0] }
        },
        dangDuyet: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "dang_duyet"] }, 1, 0] }
        },
        tuChoi: { 
          $sum: { $cond: [{ $eq: ["$trangThai", "tu_choi"] }, 1, 0] }
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
      tuChoi: item.tuChoi
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- API QUẢN LÝ CHỈ TIÊU XÉT TUYỂN ---

// GET /admin/admission-quotas - Lấy chỉ tiêu xét tuyển
router.get('/admission-quotas', async (req, res) => {
  try {
    const { schoolId, majorId, academicYear } = req.query;
    
    if (!schoolId || !majorId || !academicYear) {
      return res.status(400).json({ error: 'Thiếu thông tin schoolId, majorId hoặc academicYear' });
    }

    const quota = await AdmissionQuota.findOne({
      schoolId,
      majorId,
      academicYear: parseInt(academicYear)
    });
    
    if (!quota) {
      return res.status(404).json({ message: 'Chưa có chỉ tiêu cho trường/ngành/năm này' });
    }
    
    res.json(quota);
  } catch (error) {
    console.error('Lỗi khi lấy chỉ tiêu:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /admin/admission-quotas - Tạo/cập nhật chỉ tiêu xét tuyển
router.post('/admission-quotas', async (req, res) => {
  try {
    const { schoolId, majorId, academicYear, totalQuota, quotaByMethod } = req.body;
    
    // Validation
    if (!schoolId || !majorId || !academicYear || !totalQuota || !quotaByMethod) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }
    
    // Kiểm tra tổng chỉ tiêu
    const totalMethodQuota = Object.values(quotaByMethod).reduce((sum, quota) => sum + (quota || 0), 0);
    if (totalMethodQuota !== totalQuota) {
      return res.status(400).json({ 
        error: `Tổng chỉ tiêu các phương thức (${totalMethodQuota}) phải bằng tổng chỉ tiêu (${totalQuota})` 
      });
    }
    
    const quota = await AdmissionQuota.findOneAndUpdate(
      { schoolId, majorId, academicYear },
      { 
        schoolId, 
        majorId, 
        academicYear, 
        totalQuota, 
        quotaByMethod,
        status: 'published',
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json(quota);
  } catch (error) {
    console.error('Lỗi khi lưu chỉ tiêu:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- API QUẢN LÝ QUY TẮC XÉT TUYỂN ---

// GET /admin/admission-rules - Lấy quy tắc xét tuyển
router.get('/admission-rules', async (req, res) => {
  try {
    const { schoolId, majorId, academicYear } = req.query;
    
    const query = {};
    if (schoolId) query.schoolId = schoolId;
    if (majorId) query.majorId = majorId;
    if (academicYear) query.academicYear = academicYear;
    
    const admissionRules = await AdmissionRule.find(query);
    res.json(admissionRules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /admin/admission-rules - Tạo/cập nhật quy tắc xét tuyển
router.post('/admission-rules', async (req, res) => {
  try {
    const { schoolId, majorId, academicYear, methods } = req.body;
    
    // Tạo hoặc cập nhật quy tắc
    const admissionRule = await AdmissionRule.findOneAndUpdate(
      { schoolId, majorId, academicYear },
      { 
        schoolId, 
        majorId, 
        academicYear, 
        methods,
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );
    
    res.json(admissionRule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- API XỬ LÝ XÉT TUYỂN ---

// POST /admin/admission-process/run-filter - Chạy thuật toán lọc hồ sơ
router.post('/admission-process/run-filter', async (req, res) => {
  try {
    const { schoolId, majorId, academicYear } = req.body;
    
    if (!schoolId || !majorId || !academicYear) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }
    
    // Chạy thuật toán lọc
    const result = await filterAllProfiles(schoolId, majorId, academicYear);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /admin/admission-process/results - Lấy kết quả xét tuyển
router.get('/admission-process/results', async (req, res) => {
  try {
    const { schoolId, majorId, academicYear } = req.query;
    
    const query = { trangThai: 'trung_tuyen' };
    if (schoolId) query.truong = schoolId;
    if (majorId) query.maNganh = majorId;
    
    // Lấy danh sách hồ sơ trúng tuyển
    const profiles = await Profile.find(query).sort('phuongThuc');
    
    // Nhóm theo phương thức
    const resultsByMethod = {};
    profiles.forEach(profile => {
      if (!resultsByMethod[profile.phuongThuc]) {
        resultsByMethod[profile.phuongThuc] = [];
      }
      resultsByMethod[profile.phuongThuc].push({
        profileId: profile._id,
        maHoSo: profile.maHoSo,
        hoTen: profile.hoTen,
        phuongThuc: profile.phuongThuc,
        tenPhuongThuc: profile.tenPhuongThuc
      });
    });
    
    res.json({
      schoolId,
      majorId,
      academicYear,
      totalAdmitted: profiles.length,
      resultsByMethod
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /admin/admission-process/complete - Hoàn thành xét tuyển và gửi thông báo
router.post('/admission-process/complete', async (req, res) => {
  try {
    const { schoolId, majorId, academicYear } = req.body;
    
    if (!schoolId || !majorId || !academicYear) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc: schoolId, majorId, academicYear' });
    }
    
    // Kiểm tra chỉ tiêu tồn tại
    const quota = await AdmissionQuota.findOne({ schoolId, majorId, academicYear });
    if (!quota) {
      return res.status(400).json({ error: 'Chưa có chỉ tiêu cho trường/ngành/năm này. Vui lòng cấu hình chỉ tiêu trước.' });
    }
    
    // Tự động tạo quy tắc xét tuyển nếu chưa có
    let rule = await AdmissionRule.findOne({ schoolId, majorId, academicYear });
    if (!rule) {
      console.log('🔧 Tạo quy tắc xét tuyển mặc định...');
      rule = await AdmissionRule.create({
        schoolId,
        majorId,
        academicYear,
        methods: {
          thpt: {
            minScore: 15,
            formula: "diemTongCong + diemUuTien",
            additionalCriteria: new Map()
          },
          hsa: {
            minScore: 14,
            formula: "diemTBLop12 * 0.7 + diemTBMonHoc * 0.3",
            additionalCriteria: new Map()
          },
          tsa: {
            criteria: new Map(),
            priorityOrder: ["giai_nhat", "giai_nhi", "giai_ba"]
          },
          dgnl: {
            minScore: 12,
            additionalCriteria: new Map()
          },
          xthb: {
            formula: "diemTBHocTap * 0.6 + diemNangKhieu * 0.4",
            minScore: 13
          }
        }
      });
      console.log('✅ Đã tạo quy tắc xét tuyển');
    }
    
    console.log('🚀 Bắt đầu xét tuyển cho:', { schoolId, majorId, academicYear });
    
    // Chạy thuật toán lọc hồ sơ
    const filterResult = await filterAllProfiles(schoolId, majorId, academicYear);
    
    if (filterResult.error) {
      return res.status(400).json({ error: filterResult.error });
    }
    
    // Lấy thông tin trường và ngành để gửi email
    const school = await School.findOne({ id: schoolId });
    const major = await Major.findOne({ id: majorId, schoolId });
    
    // Chuẩn bị dữ liệu gửi email thông báo trúng tuyển
    const admissionResults = [];
    let emailResults = [];
    
    if (filterResult.results) {
      console.log('📧 Chuẩn bị gửi email thông báo trúng tuyển...');
      
      for (const methodResult of filterResult.results) {
        if (methodResult.selectedProfiles && methodResult.selectedProfiles.length > 0) {
          for (const profile of methodResult.selectedProfiles) {
            try {
              // Lấy thông tin user từ Profile
              const userProfile = await Profile.findById(profile.profileId);
              if (userProfile && userProfile.email) {
                // Tìm thông tin user để lấy tên
                const user = await User.findById(userProfile.userId);
                const userName = user ? user.ten : userProfile.hoTen;
                
                admissionResults.push({
                  userEmail: userProfile.email,
                  userName: userName || 'Thí sinh',
                  schoolName: school?.name || schoolId,
                  majorName: major?.name || majorId,
                  method: getMethodName(methodResult.method) || 'Không xác định',
                  score: profile.finalScore || 0
                });
              }
            } catch (profileError) {
              console.error('❌ Lỗi khi lấy thông tin profile:', profileError);
            }
          }
        }
      }
      
      // Gửi email thông báo hàng loạt
      if (admissionResults.length > 0) {
        console.log(`📤 Gửi ${admissionResults.length} email thông báo trúng tuyển...`);
        emailResults = await sendBulkAdmissionNotifications(admissionResults);
        console.log('✅ Hoàn thành gửi email');
      }
    }
    
    // Tính toán thống kê
    const totalProcessed = filterResult.results?.reduce((sum, r) => sum + (r.totalProfiles || 0), 0) || 0;
    const totalAccepted = filterResult.results?.reduce((sum, r) => sum + (r.selectedProfiles?.length || 0), 0) || 0;
    const emailsSent = emailResults.filter(r => r.success).length;
    const emailsFailed = emailResults.filter(r => !r.success).length;
    
    console.log('📊 Kết quả xét tuyển:', { 
      totalProcessed, 
      totalAccepted, 
      emailsSent, 
      emailsFailed 
    });
    
    res.json({
      success: true,
      message: `Xét tuyển hoàn thành! Đã gửi ${emailsSent} email thông báo trúng tuyển`,
      results: filterResult.results || [],
      emailResults,
      summary: {
        totalProcessed,
        totalAccepted,
        emailsSent,
        emailsFailed,
        emailSuccessRate: totalAccepted > 0 ? Math.round((emailsSent / totalAccepted) * 100) : 0
      }
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi thực hiện xét tuyển:', error);
    res.status(500).json({ error: error.message });
  }
});

// Hàm helper để chuyển đổi tên phương thức
function getMethodName(method) {
  const methodNames = {
    'thpt': 'Xét điểm thi THPT',
    'hsa': 'Xét học bạ',
    'tsa': 'Xét tài năng/năng khiếu',
    'dgnl': 'Xét đánh giá năng lực',
    'xthb': 'Xét tổng hợp'
  };
  return methodNames[method] || method;
}


// --- API QUẢN LÝ HỒ SƠ ---

// GET /admin/profiles - Lấy danh sách hồ sơ
router.get('/profiles', async (req, res) => {
  try {
    const { trangThai, phuongThuc, truong, nganh, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (trangThai) query.trangThai = trangThai;
    if (phuongThuc) query.phuongThuc = phuongThuc;
    if (truong) query.truong = truong;
    if (nganh) query.maNganh = nganh;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [profiles, total] = await Promise.all([
      Profile.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Profile.countDocuments(query)
    ]);
    
    res.json({
      profiles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /admin/profiles/:id/status - Cập nhật trạng thái hồ sơ
router.post('/profiles/:id/status', async (req, res) => {
  const { id } = req.params;
  const { trangThai, ghiChu } = req.body;

  if (!['duyet', 'tu_choi', 'yeu_cau_bo_sung', 'trung_tuyen'].includes(trangThai)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  try {
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
    }

    profile.trangThai = trangThai;
    profile.updatedAt = new Date();
    
    profile.lichSuTrangThai.push({
      trangThai,
      thoiGian: new Date(),
      ghiChu: ghiChu || `Cập nhật trạng thái thành ${trangThai}`
    });
    
    await profile.save();
    res.json({ message: `Đã cập nhật trạng thái thành ${trangThai}`, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm vào routes/admin.mjs
router.post('/process-admission-complete', async (req, res) => {
  try {
    const { schoolId, majorId, academicYear } = req.body;
    
    if (!schoolId || !majorId || !academicYear) {
      return res.status(400).json({ 
        error: 'Thiếu thông tin bắt buộc: schoolId, majorId, academicYear' 
      });
    }
    
    console.log('🚀 Bắt đầu xử lý xét tuyển hoàn thành cho:', { schoolId, majorId, academicYear });
    
    // Kiểm tra chỉ tiêu tồn tại
    const quota = await AdmissionQuota.findOne({ schoolId, majorId, academicYear });
    if (!quota) {
      return res.status(400).json({ 
        error: 'Chưa có chỉ tiêu cho trường/ngành/năm này. Vui lòng cấu hình chỉ tiêu trước.' 
      });
    }
    
    // Chạy thuật toán lọc hồ sơ
    const filterResult = await filterAllProfiles(schoolId, majorId, academicYear);
    
    if (filterResult.error) {
      return res.status(400).json({ error: filterResult.error });
    }
    
    // Tính toán thống kê
    const totalProcessed = filterResult.results?.reduce((sum, r) => sum + (r.totalProfiles || 0), 0) || 0;
    const totalAccepted = filterResult.results?.reduce((sum, r) => sum + (r.selectedProfiles?.length || 0), 0) || 0;
    
    console.log('📊 Kết quả xét tuyển:', { totalProcessed, totalAccepted });
    
    res.json({
      success: true,
      message: 'Xét tuyển hoàn thành thành công',
      results: filterResult.results || [],
      summary: {
        totalProcessed,
        totalAccepted,
        notificationsSent: totalAccepted
      }
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi thực hiện xét tuyển:', error);
    res.status(500).json({ 
      error: 'Lỗi server khi xử lý xét tuyển',
      details: error.message 
    });
  }
});


export { router };

import express from 'express';
import School from '../../models/School.mjs';
import Major from '../../models/Major.mjs';
import SubjectGroup from '../../models/SubjectGroup.mjs';
import Profile from '../../models/Profile.mjs';

const router = express.Router();

// API nộp hồ sơ xét tuyển - CHÍNH
router.post('/nop-ho-so', async (req, res) => {
  try {
    console.log('=== BẮT ĐẦU NỘP HỒ SƠ ===');
    console.log('Dữ liệu nhận được:', req.body);
    
    const profileData = req.body;
    
    // Validate dữ liệu cơ bản
    if (!profileData.truong || !profileData.nganh || !profileData.toHop) {
      console.log('Thiếu thông tin bắt buộc');
      return res.status(400).json({ error: 'Thiếu thông tin trường, ngành hoặc tổ hợp' });
    }
    
    // Kiểm tra trường có tồn tại
    console.log(`Kiểm tra trường: ${profileData.truong}`);
    const school = await School.findOne({ id: profileData.truong });
    if (!school) {
      console.log('Trường không tồn tại');
      return res.status(400).json({ error: 'Trường không tồn tại' });
    }
    console.log('Trường hợp lệ:', school.name);
    
    // Kiểm tra ngành có tồn tại
    console.log(`Kiểm tra ngành: ${profileData.nganh} trong trường ${profileData.truong}`);
    const major = await Major.findOne({ 
      id: profileData.nganh, 
      schoolId: profileData.truong 
    });
    if (!major) {
      console.log('Ngành không tồn tại');
      // Debug: Kiểm tra tất cả ngành của trường này
      const allMajors = await Major.find({ schoolId: profileData.truong });
      console.log('Các ngành có sẵn:', allMajors.map(m => ({ id: m.id, name: m.name })));
      return res.status(400).json({ error: 'Ngành không tồn tại' });
    }
    console.log('Ngành hợp lệ:', major.name);
    
    // Kiểm tra tổ hợp có tồn tại
    console.log(`Kiểm tra tổ hợp: ${profileData.toHop}`);
    const subjectGroup = await SubjectGroup.findOne({
      id: profileData.toHop,
      schoolId: profileData.truong,
      majorId: profileData.nganh
    });
    if (!subjectGroup) {
      console.log('Tổ hợp môn không tồn tại');
      // Debug: Kiểm tra tất cả tổ hợp
      const allSubjectGroups = await SubjectGroup.find({ 
        schoolId: profileData.truong, 
        majorId: profileData.nganh 
      });
      console.log('Các tổ hợp có sẵn:', allSubjectGroups.map(sg => ({ id: sg.id, name: sg.name })));
      return res.status(400).json({ error: 'Tổ hợp môn không tồn tại' });
    }
    console.log('Tổ hợp hợp lệ:', subjectGroup.name);
    
    // Tạo mã hồ sơ tự động
    const profileCount = await Profile.countDocuments();
    const maHoSo = `HS${(profileCount + 1).toString().padStart(6, '0')}`;
    console.log('Mã hồ sơ được tạo:', maHoSo);
    
    // Tạo hồ sơ mới
    const profile = new Profile({
      ...profileData,
      maHoSo,
      trangThai: 'dang_duyet',
      ngayNop: new Date()
    });
    
    console.log('Chuẩn bị lưu hồ sơ...');
    await profile.save();
    console.log('Lưu hồ sơ thành công!');
    
    res.status(201).json({
      message: 'Nộp hồ sơ thành công',
      maHoSo: profile.maHoSo,
      profileId: profile._id
    });
    
  } catch (error) {
    console.error('=== LỖI NỘP HỒ SƠ ===');
    console.error('Lỗi chi tiết:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// API tra cứu hồ sơ
router.get('/tra-cuu/:maHoSo', async (req, res) => {
  try {
    const { maHoSo } = req.params;
    
    const profile = await Profile.findOne({ maHoSo });
    if (!profile) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
    }
    
    // Lấy thông tin chi tiết
    const school = await School.findOne({ id: profile.truong });
    const major = await Major.findOne({ id: profile.nganh, schoolId: profile.truong });
    const subjectGroup = await SubjectGroup.findOne({ 
      id: profile.toHop, 
      schoolId: profile.truong,
      majorId: profile.nganh 
    });
    
    res.json({
      maHoSo: profile.maHoSo,
      hoTen: profile.hoTen,
      truong: school?.name || profile.truong,
      nganh: major?.name || profile.nganh,
      toHop: subjectGroup?.name || profile.toHop,
      trangThai: profile.trangThai,
      ngayNop: profile.ngayNop,
      ghiChu: profile.ghiChu
    });
    
  } catch (error) {
    console.error('Lỗi tra cứu hồ sơ:', error);
    res.status(500).json({ error: error.message });
  }
});

export { router as applicationRoutes };

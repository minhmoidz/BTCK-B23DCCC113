import fs from 'fs';
import path from 'path';
import { getPhuongThucName, safeFolderName, generateMaHoSo } from '../utils/helpers.util.mjs';
import Profile from '../models/Profile.model.mjs';
import School from '../models/School.model.mjs';
import Major from '../models/Major.model.mjs';
import SubjectGroup from '../models/SubjectGroup.model.mjs';

// --- ADMISSION METHODS ---
export const getAdmissionMethods = (req, res) => {
    const phuongThucList = [
        { code: 'tsa', name: 'Xét tuyển thẳng', description: 'Dành cho thí sinh đạt giải trong các kỳ thi học sinh giỏi' },
        { code: 'hsa', name: 'Xét tuyển học bạ', description: 'Xét tuyển dựa trên kết quả học tập THPT' },
        { code: 'thpt', name: 'Xét tuyển điểm thi THPT', description: 'Xét tuyển dựa trên kết quả kỳ thi THPT Quốc gia' },
        { code: 'dgnl', name: 'Đánh giá năng lực', description: 'Xét tuyển dựa trên kết quả bài thi đánh giá năng lực' },
        { code: 'xthb', name: 'Xét tuyển kết hợp', description: 'Kết hợp điểm học tập và năng khiếu chuyên biệt' }
    ];
    res.json(phuongThucList);
};

export const getAdmissionMethodRequirements = (req, res) => {
    const { phuongThuc } = req.params;
    const phuongThucHopLe = ['tsa', 'hsa', 'thpt', 'dgnl', 'xthb'];

    if (!phuongThucHopLe.includes(phuongThuc)) {
        return res.status(400).json({ error: 'Phương thức xét tuyển không hợp lệ' });
    }

    const requirementsMap = {
        'thpt': {
            fields: [
                { name: 'toHop', label: 'Tổ hợp môn', type: 'select', required: true },
                { name: 'tenMon1', label: 'Môn 1', type: 'text', required: true },
                { name: 'diemMon1', label: 'Điểm môn 1', type: 'number', required: true },
                { name: 'tenMon2', label: 'Môn 2', type: 'text', required: true },
                { name: 'diemMon2', label: 'Điểm môn 2', type: 'number', required: true },
                { name: 'tenMon3', label: 'Môn 3', type: 'text', required: true },
                { name: 'diemMon3', label: 'Điểm môn 3', type: 'number', required: true },
                { name: 'doiTuongUuTien', label: 'Đối tượng ưu tiên', type: 'select', required: false },
                { name: 'khuVucUuTien', label: 'Khu vực ưu tiên', type: 'select', required: false },
                { name: 'diemUuTien', label: 'Điểm ưu tiên', type: 'number', required: false }
            ],
            files: [
                { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
                { name: 'cccd', label: 'CCCD/CMND', required: true },
                { name: 'bangDiem', label: 'Bảng điểm THPT', required: true },
                { name: 'giayChungNhanUuTien', label: 'Giấy chứng nhận ưu tiên (nếu có)', required: false }
            ]
        },
        'hsa': {
            fields: [
                { name: 'diemTBLop11', label: 'Điểm TB lớp 11', type: 'number', required: true },
                { name: 'diemTBLop12', label: 'Điểm TB lớp 12', type: 'number', required: true },
                { name: 'diemTBMonHoc', label: 'Điểm TB các môn xét tuyển', type: 'number', required: true },
                { name: 'cacMonXetTuyen', label: 'Các môn xét tuyển', type: 'textarea', required: true, 
                description: 'Nhập danh sách môn học và điểm dạng JSON: [{"mon":"Toán","diem":8.5},...]' }
            ],
            files: [
                { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
                { name: 'cccd', label: 'CCCD/CMND', required: true },
                { name: 'hocBa', label: 'Học bạ THPT', required: true },
                { name: 'bangTotNghiep', label: 'Bằng tốt nghiệp THPT', required: true }
            ]
        },
        'tsa': {
            fields: [
                { name: 'loaiGiaiThuong', label: 'Loại giải thưởng', type: 'select', required: true,
                options: ['Học sinh giỏi Quốc gia', 'Olympic Quốc tế', 'Cuộc thi Khoa học kỹ thuật', 'Khác'] },
                { name: 'capGiaiThuong', label: 'Cấp giải thưởng', type: 'select', required: true,
                options: ['Quốc tế', 'Quốc gia', 'Tỉnh/Thành phố'] },
                { name: 'tenGiaiThuong', label: 'Tên giải thưởng', type: 'text', required: true },
                { name: 'namDoatGiai', label: 'Năm đoạt giải', type: 'number', required: true }
            ],
            files: [
                { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
                { name: 'cccd', label: 'CCCD/CMND', required: true },
                { name: 'bangTotNghiep', label: 'Bằng tốt nghiệp THPT', required: true },
                { name: 'giayChungNhanGiaiThuong', label: 'Giấy chứng nhận giải thưởng', required: true }
            ]
        },
        'dgnl': {
            fields: [
                { name: 'diemDanhGiaNangLuc', label: 'Điểm đánh giá năng lực', type: 'number', required: true },
                { name: 'ngayThi', label: 'Ngày thi', type: 'date', required: true },
                { name: 'noiThi', label: 'Nơi thi', type: 'text', required: true },
                { name: 'soBaoDanh', label: 'Số báo danh', type: 'text', required: true }
            ],
            files: [
                { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
                { name: 'cccd', label: 'CCCD/CMND', required: true },
                { name: 'ketQuaDanhGiaNangLuc', label: 'Kết quả đánh giá năng lực', required: true }
            ]
        },
        'xthb': {
            fields: [
                { name: 'diemTBHocTap', label: 'Điểm TB học tập', type: 'number', required: true },
                { name: 'diemNangKhieu', label: 'Điểm năng khiếu', type: 'number', required: true },
                { name: 'loaiNangKhieu', label: 'Loại năng khiếu', type: 'select', required: true,
                options: ['Nghệ thuật', 'Thể thao', 'Ngoại ngữ', 'Tin học', 'Khác'] },
                { name: 'diemPhongVan', label: 'Điểm phỏng vấn', type: 'number', required: false },
                { name: 'ngayPhongVan', label: 'Ngày phỏng vấn', type: 'date', required: false }
            ],
            files: [
                { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
                { name: 'cccd', label: 'CCCD/CMND', required: true },
                { name: 'hocBa', label: 'Học bạ THPT', required: true },
                { name: 'chungChiNangKhieu', label: 'Chứng chỉ năng khiếu', required: true }
            ]
        }
    };

    res.json({
        phuongThuc,
        tenPhuongThuc: getPhuongThucName(phuongThuc),
        requirements: requirementsMap[phuongThuc]
    });
};

// Validation cho từng phương thức xét tuyển
const validateMethodSpecificData = async (phuongThuc, req, res) => {
  const { truong, maNganh } = req.body;
  let phuongThucData = {};
  let requiredFileTypes = [];
  
  switch(phuongThuc) {
    case 'thpt': {
      const { toHop, diemMon1, diemMon2, diemMon3, tenMon1, tenMon2, tenMon3, diemUuTien, doiTuongUuTien, khuVucUuTien } = req.body;
      
      if (!toHop || !diemMon1 || !diemMon2 || !diemMon3 || !tenMon1 || !tenMon2 || !tenMon3) {
        throw new Error('Thiếu thông tin bắt buộc cho phương thức xét tuyển THPT');
      }
      
      // Kiểm tra tổ hợp môn có tồn tại không
      const subjectGroup = await SubjectGroup.findOne({ 
        id: toHop, 
        schoolId: truong, 
        majorId: maNganh 
      });
      
      if (!subjectGroup) {
        console.log('Subject group not found:', { toHop, truong, maNganh });
        console.log('Available subject groups:', await SubjectGroup.find({ schoolId: truong, majorId: maNganh }));
        throw new Error('Tổ hợp môn không tồn tại');
      }
      
      const totalScore = parseFloat(diemMon1) + parseFloat(diemMon2) + parseFloat(diemMon3);
      const priorityScore = parseFloat(diemUuTien || 0);
      const finalScore = totalScore + priorityScore;
      
      phuongThucData = {
        toHop,
        maToHop: req.body.maToHop,
        monThi: [
          { ten: tenMon1, diem: parseFloat(diemMon1) },
          { ten: tenMon2, diem: parseFloat(diemMon2) },
          { ten: tenMon3, diem: parseFloat(diemMon3) }
        ],
        diemTongCong: totalScore,
        diemUuTien: priorityScore,
        diemXetTuyen: finalScore,
        doiTuongUuTien,
        khuVucUuTien
      };
      
      requiredFileTypes = ['anhChanDung', 'cccd', 'bangDiem'];
      break;
    }
    
    case 'hsa': {
      const { diemTBLop11, diemTBLop12, diemTBMonHoc, cacMonXetTuyen } = req.body;
      
      if (!diemTBLop11 || !diemTBLop12 || !diemTBMonHoc || !cacMonXetTuyen) {
        throw new Error('Thiếu thông tin bắt buộc cho phương thức xét tuyển học bạ');
      }
      
      let monHoc = [];
      try {
        monHoc = JSON.parse(cacMonXetTuyen);
      } catch (e) {
        throw new Error('Định dạng danh sách môn học không hợp lệ');
      }
      
      phuongThucData = {
        diemTBLop11: parseFloat(diemTBLop11),
        diemTBLop12: parseFloat(diemTBLop12),
        diemTBMonHoc: parseFloat(diemTBMonHoc),
        monHoc
      };
      
      requiredFileTypes = ['anhChanDung', 'cccd', 'hocBa', 'bangTotNghiep'];
      break;
    }
    
    case 'tsa': {
      const { loaiGiaiThuong, capGiaiThuong, tenGiaiThuong, namDoatGiai } = req.body;
      
      if (!loaiGiaiThuong || !capGiaiThuong || !tenGiaiThuong || !namDoatGiai) {
        throw new Error('Thiếu thông tin bắt buộc cho phương thức xét tuyển thẳng');
      }
      
      phuongThucData = {
        loaiGiaiThuong,
        capGiaiThuong,
        tenGiaiThuong,
        namDoatGiai
      };
      
      requiredFileTypes = ['anhChanDung', 'cccd', 'bangTotNghiep', 'giayChungNhanGiaiThuong'];
      break;
    }
    
    case 'dgnl': {
      const { diemDanhGiaNangLuc, ngayThi, noiThi, soBaoDanh } = req.body;
      
      if (!diemDanhGiaNangLuc || !ngayThi || !noiThi || !soBaoDanh) {
        throw new Error('Thiếu thông tin bắt buộc cho phương thức đánh giá năng lực');
      }
      
      phuongThucData = {
        diemDanhGiaNangLuc: parseFloat(diemDanhGiaNangLuc),
        ngayThi,
        noiThi,
        soBaoDanh
      };
      
      requiredFileTypes = ['anhChanDung', 'cccd', 'ketQuaDanhGiaNangLuc'];
      break;
    }
    
    case 'xthb': {
      const { diemTBHocTap, diemNangKhieu, loaiNangKhieu, diemPhongVan, ngayPhongVan } = req.body;
      
      if (!diemTBHocTap || !diemNangKhieu || !loaiNangKhieu) {
        throw new Error('Thiếu thông tin bắt buộc cho phương thức xét tuyển kết hợp');
      }
      
      phuongThucData = {
        diemTBHocTap: parseFloat(diemTBHocTap),
        diemNangKhieu: parseFloat(diemNangKhieu),
        loaiNangKhieu,
        diemPhongVan: diemPhongVan ? parseFloat(diemPhongVan) : null,
        ngayPhongVan
      };
      
      requiredFileTypes = ['anhChanDung', 'cccd', 'hocBa', 'chungChiNangKhieu'];
      break;
    }
  }
  
  return { phuongThucData, requiredFileTypes };
};

// --- APPLICATIONS ---
export const submitApplication = async (req, res) => {
  try {
    const userId = req.userId;
    const { phuongThuc } = req.params;
    
    console.log(`Processing application for method: ${phuongThuc}, user: ${userId}`);
    
    // Thông tin cơ bản
    const {
      hoTen, ngaySinh, gioiTinh, danToc, soCCCD, ngayCapCCCD, noiCapCCCD,
      diaChiThuongTru, diaChiLienHe, email, soDienThoai, soDienThoaiPhuHuynh,
      truongTHPT, maTruongTHPT, tinhThanhTHPT, namTotNghiep,
      truong, maTruong, nganh, maNganh,
      nguyenVong, ghiChu
    } = req.body;

    console.log('Application data:', { truong, maNganh, nganh, hoTen });

    // KIỂM TRA TRƯỜNG VÀ NGÀNH TRONG DATABASE
    console.log('Validating school and major...');
    
    // Kiểm tra trường có tồn tại không
    const school = await School.findOne({ id: truong });
    if (!school) {
      console.log('School not found:', truong);
      console.log('Available schools:', await School.find({}, 'id name'));
      return res.status(400).json({ error: 'Trường không tồn tại' });
    }
    
    // Kiểm tra ngành có tồn tại không
    const major = await Major.findOne({ id: maNganh, schoolId: truong });
    if (!major) {
      console.log('Major not found:', { maNganh, truong });
      console.log('Available majors for school:', await Major.find({ schoolId: truong }, 'id name'));
      return res.status(400).json({ error: 'Ngành không tồn tại' });
    }

    console.log('✓ School found:', school.name);
    console.log('✓ Major found:', major.name);

    // Validate dữ liệu riêng theo từng phương thức
    const { phuongThucData, requiredFileTypes } = await validateMethodSpecificData(phuongThuc, req, res);

    // Kiểm tra file đã tải lên
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'Không có file nào được tải lên' });
    }

    // Tạo thư mục lưu file
    const folderName = safeFolderName(`${hoTen}_${soCCCD}_${phuongThuc}`);
    const userDir = path.join('uploads', folderName);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Phân loại và lưu file
    const savedFiles = [];
    const fileCategories = {};
    
    for (const type of requiredFileTypes) {
      fileCategories[type] = null;
    }
    
    Object.keys(req.files).forEach(fileType => {
      if (req.files[fileType] && req.files[fileType].length > 0) {
        const file = req.files[fileType][0];
        const destPath = path.join(userDir, `${fileType}_${Date.now()}${path.extname(file.originalname)}`);
        fs.renameSync(file.path, destPath);
        
        savedFiles.push(destPath);
        if (fileCategories.hasOwnProperty(fileType)) {
          fileCategories[fileType] = destPath;
        }
      }
    });
    
    const missingFiles = requiredFileTypes.filter(type => !fileCategories[type]);
    if (missingFiles.length > 0) {
      return res.status(400).json({ 
        error: `Thiếu các file bắt buộc: ${missingFiles.join(', ')}`,
        requiredFiles: requiredFileTypes
      });
    }

    // Lưu hồ sơ vào MongoDB
    const newProfile = new Profile({
      userId,
      maHoSo: generateMaHoSo(phuongThuc),
      
      phuongThuc,
      tenPhuongThuc: getPhuongThucName(phuongThuc),
      
      hoTen, ngaySinh, gioiTinh, danToc, soCCCD, ngayCapCCCD, noiCapCCCD,
      diaChiThuongTru, diaChiLienHe, email, soDienThoai, soDienThoaiPhuHuynh,
      truongTHPT, maTruongTHPT, tinhThanhTHPT, namTotNghiep,
      truong, maTruong, nganh, maNganh,
      
      ...phuongThucData,
      
      nguyenVong: parseInt(nguyenVong || 1),
      ghiChu,
      
      files: savedFiles,
      fileCategories,
      
      trangThai: 'dang_duyet',
      lichSuTrangThai: [{
        trangThai: 'dang_duyet',
        thoiGian: new Date(),
        ghiChu: `Hồ sơ mới nộp - Phương thức ${getPhuongThucName(phuongThuc)}`
      }]
    });
    
    await newProfile.save();
    console.log('✓ Profile saved successfully:', newProfile.maHoSo);

    res.json({ 
      message: 'Hồ sơ đã nhận thành công!', 
      data: {
        id: newProfile._id,
        maHoSo: newProfile.maHoSo,
        hoTen: newProfile.hoTen,
        phuongThuc: newProfile.phuongThuc,
        tenPhuongThuc: newProfile.tenPhuongThuc,
        trangThai: newProfile.trangThai,
        createdAt: newProfile.createdAt
      }
    });
  } catch (err) {
    console.error('Lỗi xử lý hồ sơ:', err);
    
    // Xóa các file tạm nếu có lỗi
    if (req.files) {
      Object.keys(req.files).forEach(fileType => {
        if (req.files[fileType] && req.files[fileType].length > 0) {
          req.files[fileType].forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }
      });
    }
    
    res.status(500).json({ error: err.message });
  }
};

// --- MAJORS ---
export const getMajorsBySchool = async (req, res) => {
  try {
    const { truongKey } = req.params;
    console.log('Getting majors for school:', truongKey);
    
    const majors = await Major.find({ schoolId: truongKey }).sort('name');
    console.log(`Found ${majors.length} majors for school ${truongKey}`);
    
    if (majors && majors.length > 0) {
      res.json(majors.map(major => ({
        id: major.id,
        name: major.name
      })));
    } else {
      console.log('No majors found in database for school:', truongKey);
      res.json([]);
    }
  } catch (error) {
    console.error('Error getting majors:', error);
    res.status(500).json({ error: error.message });
  }
};

// --- PROFILES ---
export const getUserProfiles = async (req, res) => {
  const userId = req.userId;
  try {
    const userProfiles = await Profile.find({ userId }).sort({ createdAt: -1 });
    res.json(userProfiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminProfiles = async (req, res) => {
  try {
    const { trangThai, phuongThuc, truong, nganh } = req.query;
    
    let query = {};
    
    if (trangThai) query.trangThai = trangThai;
    if (phuongThuc) query.phuongThuc = phuongThuc;
    if (truong) query.truong = truong;
    if (nganh) query.maNganh = nganh;
    
    const profiles = await Profile.find(query).sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdminProfileStatus = async (req, res) => {
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
};

// --- SCHOOLS ---
export const getSchoolsList = async (req, res) => {
  try {
    console.log('Getting schools from database...');
    const schools = await School.find().sort('name');
    console.log(`Found ${schools.length} schools`);
    
    res.json(schools.map(school => ({
      id: school.id,
      name: school.name
    })));
  } catch (error) {
    console.error('Error getting schools:', error);
    res.status(500).json({ error: error.message });
  }
};

// --- STATISTICS ---
export const getMajorStatisticsPublic = async (req, res) => {
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
};

export const getSchoolStatisticsAdmin = async (req, res) => {
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
};

// --- SUBJECT GROUPS ---
export const getSubjectGroupsBySchoolAndMajor = async (req, res) => {
  try {
    const { truongKey, nganhKey } = req.params;
    console.log('Getting subject groups for:', { truongKey, nganhKey });
    
    const subjectGroups = await SubjectGroup.find({
      schoolId: truongKey,
      majorId: nganhKey
    }).sort('id');
    
    console.log(`Found ${subjectGroups.length} subject groups`);
    
    res.json(subjectGroups.map(group => ({
      id: group.id,
      name: group.name,
      methods: group.methods || ['thpt']
    })));
  } catch (error) {
    console.error('Error getting subject groups:', error);
    res.status(500).json({ error: error.message });
  }
}; 
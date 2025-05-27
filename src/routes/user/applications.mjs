import express from 'express';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from '../../auth.mjs';
import { uploadFields } from './middleware/upload.mjs';
import { validateAdmissionMethod, validateRequiredFields } from './middleware/validation.mjs';
import { safeFolderName, generateMaHoSo, getPhuongThucName } from '../../utils/utils.mjs';
import Profile from '../../models/Profile.mjs';
import School from '../../models/School.mjs';
import Major from '../../models/Major.mjs';
import SubjectGroup from '../../models/SubjectGroup.mjs';

const router = express.Router();

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

// API nộp hồ sơ xét tuyển
router.post('/xettuyen/:phuongThuc', 
  authMiddleware, 
  validateAdmissionMethod,
  uploadFields, 
  validateRequiredFields(['hoTen', 'ngaySinh', 'soCCCD', 'diaChiThuongTru', 'soDienThoai', 'truong', 'nganh']),
  async (req, res) => {
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
  }
);

export default router;

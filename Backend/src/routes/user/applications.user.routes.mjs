import express from 'express';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from '../../auth.mjs';
import { uploadFields } from '../../middleware/upload.middleware.mjs';
import { validateAdmissionMethod, validateRequiredFields } from '../../middleware/validation.middleware.mjs';
import { safeFolderName, generateMaHoSo, getPhuongThucName } from '../../utils/helpers.util.mjs';
import Profile from '../../models/Profile.model.mjs';
import School from '../../models/School.model.mjs';
import Major from '../../models/Major.model.mjs';
import SubjectGroup from '../../models/SubjectGroup.model.mjs';
import { submitApplication } from '../../controllers/user.controller.mjs';

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
  submitApplication
);

export default router; 
// --- START OF FILE donXetTuyenController.mjs ---

import fs from 'fs';
import multer from 'multer';
import {
  submitDonXetTuyenService,
  getDonXetTuyenByUserService,
  updateTrangThaiDonService,
  getDonXetTuyenByIdService
} from '../services/donXetTuyen.service.mjs';

// Helper function để xóa files đã upload
const cleanupUploadedFiles = (files) => {
  if (files && files.length > 0) {
    files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.error("Lỗi khi dọn dẹp file:", e);
      }
    });
  }
};

// Nộp đơn xét tuyển
export const submitDonXetTuyen = async (req, res) => {
  try {
    const { ...donXetTuyenBody } = req.body;

    // Xử lý file minh chứng
    const minhChungData = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        minhChungData.push({
          tenFile: file.originalname,
          duongDan: `/uploads/minhchung/${file.filename}`,
          loaiFile: file.mimetype
        });
      });
    }

    // Gộp body và thông tin minh chứng
    const donXetTuyenDataForService = {
      ...donXetTuyenBody,
      minhChung: minhChungData
    };

    const donXetTuyen = await submitDonXetTuyenService(donXetTuyenDataForService, req.files);
    res.status(201).json({ message: 'Nộp đơn thành công', donXetTuyen });

  } catch (error) {
    // Xóa các file đã upload nếu có lỗi xảy ra từ service hoặc controller
    cleanupUploadedFiles(req.files);

    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: "Dữ liệu không hợp lệ từ validation schema", errors });
    }

    // Lỗi nghiệp vụ từ service (đã có statusCode)
    if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    // Xử lý lỗi Multer (ví dụ: file quá lớn, loại file không hợp lệ từ fileFilter trong route)
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File quá lớn. Kích thước tối đa là 10MB.' });
      }
      // Mã lỗi 'LIMIT_UNEXPECTED_FILE' thường do fileFilter của multer trả về lỗi
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Loại file không hợp lệ hoặc có vấn đề với tên field của file.' });
      }
      return res.status(400).json({ message: `Lỗi upload file: ${error.message}` });
    }

    // Lỗi có thể do `cb(new Error('...'))` trong fileFilter của route được ném ra
    // Hoặc lỗi chung từ service không có statusCode cụ thể
    // (Mặc dù service đã cố gắng throw error có statusCode cho các lỗi nghiệp vụ)
    if (error.message && (error.message.includes('Loại file không hợp lệ') || error.message.includes('Lỗi: Chỉ cho phép upload'))) {
        return res.status(400).json({ message: error.message });
    }

    console.error("Lỗi server khi nộp đơn:", error);
    res.status(500).json({ message: 'Lỗi server không xác định', errorDetails: error.message });
  }
};

// Lấy danh sách đơn xét tuyển của user
export const getDonXetTuyenByUser = async (req, res) => {
  try {
    const donXetTuyenList = await getDonXetTuyenByUserService(req.params.userId);
    res.json(donXetTuyenList);
  } catch (error) {
    console.error("Lỗi khi lấy đơn xét tuyển của user:", error);
    // Lỗi từ service thường là lỗi chung ở đây
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy danh sách đơn xét tuyển' });
  }
};

// Cập nhật trạng thái đơn xét tuyển
export const updateTrangThaiDon = async (req, res) => {
  try {
    const { trangThai } = req.body;
    if (!trangThai) {
        return res.status(400).json({ message: "Trạng thái là bắt buộc."});
    }

    const donXetTuyen = await updateTrangThaiDonService(req.params.id, trangThai);
    res.json(donXetTuyen);

  } catch (error) {
    if (error.name === 'ValidationError') { // Từ runValidators trong service
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: "Dữ liệu không hợp lệ cho trạng thái", errors });
    }
    if (error.statusCode) { // Lỗi nghiệp vụ từ service (trạng thái không hợp lệ, không tìm thấy đơn)
        return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Lỗi khi cập nhật trạng thái đơn:", error);
    res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật trạng thái đơn' });
  }
};

// Lấy chi tiết một đơn xét tuyển
export const getDonXetTuyenById = async (req, res) => {
  try {
    const donXetTuyen = await getDonXetTuyenByIdService(req.params.id);
    res.json(donXetTuyen);
  } catch (error) {
    if (error.statusCode === 404) {
        return res.status(404).json({ message: error.message });
    }
    console.error("Lỗi khi lấy chi tiết đơn xét tuyển:", error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy chi tiết đơn' });
  }
};

// --- END OF FILE donXetTuyenController.mjs ---
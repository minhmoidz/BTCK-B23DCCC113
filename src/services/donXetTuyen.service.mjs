import DonXetTuyen from '../models/DonXetTuyen.mjs';
import Nganh from '../models/Nganh.mjs';
import fs from 'fs';
import multer from 'multer'; // Cần thiết để check instanceof MulterError nếu lỗi từ multer được pass lên service

// Nộp đơn xét tuyển
export const submitDonXetTuyenService = async (donXetTuyenData, files) => {
  try {
    const { nganhId, phuongThucXetTuyen, toHopXetTuyen, diemThi, diemHocBa } = donXetTuyenData;

    // 1. Kiểm tra ngành và phương thức xét tuyển
    const nganh = await Nganh.findById(nganhId);
    if (!nganh) {
      // Nếu ngành không tồn tại, service sẽ throw error, controller sẽ xử lý xóa file
      const error = new Error('Không tìm thấy ngành học');
      error.statusCode = 404;
      throw error;
    }

    if (!nganh.phuongThucXetTuyen.includes(phuongThucXetTuyen)) {
      const error = new Error('Phương thức xét tuyển không hợp lệ cho ngành này');
      error.statusCode = 400;
      throw error;
    }

    // 2. Xử lý file minh chứng (logic này vẫn ở controller vì liên quan req.files)
    // Service sẽ nhận `minhChung` đã được xử lý từ controller

    // 3. Tạo đối tượng DonXetTuyen (dữ liệu đã được chuẩn bị ở controller)
    const donXetTuyenToSave = { ...donXetTuyenData }; // bao gồm minhChung đã xử lý

    // Kiểm tra điều kiện cho các trường điểm dựa trên phương thức xét tuyển
    if (phuongThucXetTuyen === 'diem_thi') {
      if (!toHopXetTuyen) {
        const error = new Error('Tổ hợp xét tuyển là bắt buộc cho phương thức điểm thi.');
        error.statusCode = 400;
        throw error;
      }
      if (diemThi === undefined || diemThi === null || isNaN(parseFloat(diemThi))) {
        const error = new Error('Điểm thi là bắt buộc và phải là số cho phương thức điểm thi.');
        error.statusCode = 400;
        throw error;
      }
      donXetTuyenToSave.toHopXetTuyen = toHopXetTuyen;
      donXetTuyenToSave.diemThi = Number(diemThi);
    } else if (phuongThucXetTuyen === 'tsa') {
      if (diemThi === undefined || diemThi === null || isNaN(parseFloat(diemThi))) {
        const error = new Error('Điểm thi TSA là bắt buộc và phải là số.');
        error.statusCode = 400;
        throw error;
      }
      donXetTuyenToSave.diemThi = Number(diemThi);
    } else if (phuongThucXetTuyen === 'hoc_ba') {
      if (diemHocBa === undefined || diemHocBa === null || isNaN(parseFloat(diemHocBa))) {
        const error = new Error('Điểm học bạ là bắt buộc và phải là số.');
        error.statusCode = 400;
        throw error;
      }
      donXetTuyenToSave.diemHocBa = Number(diemHocBa);
      if (!donXetTuyenToSave.minhChung || donXetTuyenToSave.minhChung.length === 0) {
        const error = new Error('Minh chứng là bắt buộc cho phương thức xét tuyển học bạ.');
        error.statusCode = 400;
        throw error;
      }
    }

    const donXetTuyen = new DonXetTuyen(donXetTuyenToSave);
    await donXetTuyen.save();
    return donXetTuyen;

  } catch (error) {
    // Nếu lỗi là ValidationError từ Mongoose, thì re-throw để controller xử lý
    if (error.name === 'ValidationError') {
      throw error;
    }
    // Nếu là lỗi đã được gán statusCode (lỗi nghiệp vụ từ service)
    if (error.statusCode) {
        throw error;
    }
    // Các lỗi khác (ví dụ: lỗi kết nối DB)
    throw new Error(`Lỗi server khi xử lý đơn xét tuyển: ${error.message}`);
  }
};

// Lấy danh sách đơn xét tuyển của user
export const getDonXetTuyenByUserService = async (userId) => {
  try {
    const donXetTuyenList = await DonXetTuyen.find({ userId })
      .populate('truongId', 'tenTruong maTruong')
      .populate('nganhId', 'tenNganh maNganh');
    return donXetTuyenList;
  } catch (error) {
    throw new Error(`Lỗi khi lấy đơn xét tuyển của user: ${error.message}`);
  }
};

// Cập nhật trạng thái đơn xét tuyển
export const updateTrangThaiDonService = async (donId, trangThaiMoi) => {
  try {
    // Kiểm tra xem trangThai có nằm trong enum của schema không
    const validStatuses = DonXetTuyen.schema.path('trangThai').enumValues;
    if (!validStatuses.includes(trangThaiMoi)) {
      const error = new Error(`Trạng thái không hợp lệ. Các trạng thái hợp lệ là: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const donXetTuyen = await DonXetTuyen.findByIdAndUpdate(
      donId,
      { trangThai: trangThaiMoi, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!donXetTuyen) {
      const error = new Error('Không tìm thấy đơn xét tuyển để cập nhật');
      error.statusCode = 404;
      throw error;
    }
    return donXetTuyen;
  } catch (error) {
    if (error.name === 'ValidationError') { // Có thể xảy ra nếu runValidators fail
        throw error;
    }
    if (error.statusCode) {
        throw error;
    }
    throw new Error(`Lỗi khi cập nhật trạng thái đơn: ${error.message}`);
  }
};

// Lấy chi tiết một đơn xét tuyển
export const getDonXetTuyenByIdService = async (donId) => {
  try {
    const donXetTuyen = await DonXetTuyen.findById(donId)
      .populate('truongId', 'tenTruong maTruong website diaChi')
      .populate('nganhId', 'tenNganh maNganh chiTieu phuongThucXetTuyen toHopXetTuyen');
    if (!donXetTuyen) {
      const error = new Error('Không tìm thấy đơn xét tuyển');
      error.statusCode = 404;
      throw error;
    }
    return donXetTuyen;
  } catch (error) {
    if (error.statusCode) {
        throw error;
    }
    throw new Error(`Lỗi khi lấy chi tiết đơn xét tuyển: ${error.message}`);
  }
}; 
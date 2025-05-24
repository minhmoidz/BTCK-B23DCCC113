import Nganh from '../models/Nganh.mjs';

// Lấy danh sách ngành theo trường
export const getNganhByTruongService = async (truongId) => {
  try {
    const nganh = await Nganh.find({ truongId });
    return nganh;
  } catch (error) {
    // Để controller xử lý việc gửi response lỗi cụ thể
    throw new Error(`Lỗi khi lấy danh sách ngành theo trường: ${error.message}`);
  }
};

// Lấy chi tiết một ngành
export const getNganhByIdService = async (nganhId) => {
  try {
    const nganh = await Nganh.findById(nganhId);
    if (!nganh) {
      return null; // Controller sẽ xử lý việc trả về 404
    }
    return nganh;
  } catch (error) {
    throw new Error(`Lỗi khi lấy chi tiết ngành: ${error.message}`);
  }
};

// Tạo ngành mới
export const createNganhService = async (nganhData) => {
  try {
    const nganh = new Nganh(nganhData);
    await nganh.save();
    return nganh;
  } catch (error) {
    // Có thể thêm kiểm tra lỗi validation ở đây hoặc để controller xử lý
    throw new Error(`Lỗi khi tạo ngành mới: ${error.message}`);
  }
};

// Cập nhật thông tin ngành
export const updateNganhService = async (nganhId, nganhDataToUpdate) => {
  try {
    const nganh = await Nganh.findByIdAndUpdate(
      nganhId,
      { ...nganhDataToUpdate, updatedAt: Date.now() },
      { new: true, runValidators: true } // runValidators để đảm bảo dữ liệu hợp lệ
    );
    if (!nganh) {
      return null; // Controller sẽ xử lý việc trả về 404
    }
    return nganh;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật ngành: ${error.message}`);
  }
}; 
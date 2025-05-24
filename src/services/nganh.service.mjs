import Nganh from '../models/Nganh.mjs';

// Lấy danh sách tất cả các ngành (không phân biệt trường)
export const getAllNganhsService = async () => {
  try {
    // Populate thêm thông tin trường để hiển thị rõ hơn (tùy chọn)
    const nganhs = await Nganh.find().populate('truongId', 'tenTruong maTruong');
    return nganhs;
  } catch (error) {
    throw new Error(`Lỗi khi lấy tất cả các ngành: ${error.message}`);
  }
};

// Lấy danh sách ngành theo trường
export const getNganhByTruongService = async (truongId) => {
  try {
    const nganh = await Nganh.find({ truongId }).populate('truongId', 'tenTruong maTruong');
    return nganh;
  } catch (error) {
    // Để controller xử lý việc gửi response lỗi cụ thể
    throw new Error(`Lỗi khi lấy danh sách ngành theo trường: ${error.message}`);
  }
};

// Lấy chi tiết một ngành
export const getNganhByIdService = async (nganhId) => {
  try {
    const nganh = await Nganh.findById(nganhId).populate('truongId', 'tenTruong maTruong');
    if (!nganh) {
      const error = new Error('Không tìm thấy ngành học.');
      error.statusCode = 404;
      throw error;
    }
    return nganh;
  } catch (error) {
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi lấy chi tiết ngành: ${error.message}`);
  }
};

// Tạo ngành mới
export const createNganhService = async (nganhData) => {
  try {
    // Kiểm tra mã ngành đã tồn tại trong cùng trường chưa (nếu mã ngành cần unique theo trường)
    // Hoặc mã ngành unique toàn hệ thống (hiện tại schema đang là unique toàn hệ thống cho maNganh)
    const existingNganh = await Nganh.findOne({ maNganh: nganhData.maNganh });
    if (existingNganh) {
        const error = new Error('Mã ngành đã tồn tại trong hệ thống.');
        error.statusCode = 409;
        throw error;
    }

    const nganh = new Nganh(nganhData);
    await nganh.save();
    return nganh;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Dữ liệu tạo ngành không hợp lệ.');
      validationError.statusCode = 400;
      validationError.details = Object.values(error.errors).map(e => e.message);
      throw validationError;
    }
    if (error.statusCode) throw error; 
    throw new Error(`Lỗi khi tạo ngành mới: ${error.message}`);
  }
};

// Cập nhật thông tin ngành
export const updateNganhService = async (nganhId, nganhDataToUpdate) => {
  try {
    // Nếu maNganh được cập nhật, kiểm tra tính duy nhất của nó (trừ chính ngành đang cập nhật)
    if (nganhDataToUpdate.maNganh) {
        const existingNganhWithMa = await Nganh.findOne({
            maNganh: nganhDataToUpdate.maNganh,
            _id: { $ne: nganhId } 
        });
        if (existingNganhWithMa) {
            const error = new Error('Mã ngành đã tồn tại cho một ngành khác.');
            error.statusCode = 409;
            throw error;
        }
    }

    const nganh = await Nganh.findByIdAndUpdate(
      nganhId,
      { ...nganhDataToUpdate, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!nganh) {
      const error = new Error('Không tìm thấy ngành học để cập nhật.');
      error.statusCode = 404;
      throw error;
    }
    return nganh;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Dữ liệu cập nhật ngành không hợp lệ.');
      validationError.statusCode = 400;
      validationError.details = Object.values(error.errors).map(e => e.message);
      throw validationError;
    }
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi cập nhật ngành: ${error.message}`);
  }
};

// Xóa ngành
export const deleteNganhService = async (nganhId) => {
  try {
    const nganh = await Nganh.findByIdAndDelete(nganhId);
    if (!nganh) {
      const error = new Error('Không tìm thấy ngành học để xóa.');
      error.statusCode = 404;
      throw error;
    }
    // TODO: Cân nhắc xóa các đơn xét tuyển liên quan đến ngành này nếu cần.
    return { message: 'Xóa ngành thành công.' };
  } catch (error) {
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi xóa ngành: ${error.message}`);
  }
}; 
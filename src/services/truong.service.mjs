import Truong from '../models/Truong.mjs';

// Tạo trường mới
export const createTruongService = async (truongData) => {
  try {
    // Kiểm tra xem mã trường đã tồn tại chưa (maTruong là unique)
    const existingTruong = await Truong.findOne({ maTruong: truongData.maTruong });
    if (existingTruong) {
      const error = new Error('Mã trường đã tồn tại.');
      error.statusCode = 409; // Conflict
      throw error;
    }
    const truong = new Truong(truongData);
    await truong.save();
    return truong;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Dữ liệu tạo trường không hợp lệ.');
      validationError.statusCode = 400;
      validationError.details = Object.values(error.errors).map(e => e.message);
      throw validationError;
    }
    // Ném lại lỗi đã có statusCode hoặc lỗi chung
    throw error;
  }
};

// Lấy tất cả các trường
export const getAllTruongsService = async () => {
  try {
    const truongs = await Truong.find();
    return truongs;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách trường: ${error.message}`);
  }
};

// Lấy thông tin chi tiết một trường bằng ID
export const getTruongByIdService = async (truongId) => {
  try {
    const truong = await Truong.findById(truongId);
    if (!truong) {
      const error = new Error('Không tìm thấy trường học.');
      error.statusCode = 404;
      throw error;
    }
    return truong;
  } catch (error) {
    // Ném lại lỗi đã có statusCode hoặc lỗi chung
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi lấy chi tiết trường: ${error.message}`);
  }
};

// Cập nhật thông tin trường
export const updateTruongService = async (truongId, dataToUpdate) => {
  try {
    // Nếu maTruong được cập nhật, kiểm tra tính duy nhất của nó (trừ chính trường đang cập nhật)
    if (dataToUpdate.maTruong) {
      const existingTruongWithMa = await Truong.findOne({
        maTruong: dataToUpdate.maTruong,
        _id: { $ne: truongId } // $ne: not equal
      });
      if (existingTruongWithMa) {
        const error = new Error('Mã trường đã tồn tại cho một trường khác.');
        error.statusCode = 409;
        throw error;
      }
    }

    const truong = await Truong.findByIdAndUpdate(truongId, dataToUpdate, {
      new: true, // Trả về bản ghi đã được cập nhật
      runValidators: true, // Chạy qua các validator của schema
    });
    if (!truong) {
      const error = new Error('Không tìm thấy trường để cập nhật.');
      error.statusCode = 404;
      throw error;
    }
    return truong;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Dữ liệu cập nhật trường không hợp lệ.');
      validationError.statusCode = 400;
      validationError.details = Object.values(error.errors).map(e => e.message);
      throw validationError;
    }
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi cập nhật trường: ${error.message}`);
  }
};

// Xóa trường
export const deleteTruongService = async (truongId) => {
  try {
    const truong = await Truong.findByIdAndDelete(truongId);
    if (!truong) {
      const error = new Error('Không tìm thấy trường để xóa.');
      error.statusCode = 404;
      throw error;
    }
    // TODO: Cân nhắc xử lý các thực thể liên quan (ví dụ: Ngành của trường này) nếu cần.
    // Ví dụ: Xóa tất cả ngành thuộc trường này: await Nganh.deleteMany({ truongId });
    return { message: 'Xóa trường thành công.' };
  } catch (error) {
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi xóa trường: ${error.message}`);
  }
};

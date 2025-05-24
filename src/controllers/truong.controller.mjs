import {
  createTruongService,
  getAllTruongsService,
  getTruongByIdService,
  updateTruongService,
  deleteTruongService
} from '../services/truong.service.mjs';

// Tạo trường mới (Admin)
export const createTruong = async (req, res) => {
  try {
    const truong = await createTruongService(req.body);
    res.status(201).json({ message: 'Tạo trường mới thành công', truong });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi tạo trường.';
    const response = { message };
    if (error.details) response.details = error.details;
    console.error("Lỗi khi tạo trường (controller):", error);
    res.status(statusCode).json(response);
  }
};

// Lấy danh sách tất cả các trường (Public)
export const getAllTruongs = async (req, res) => {
  try {
    const truongs = await getAllTruongsService();
    res.status(200).json(truongs);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trường (controller):", error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy danh sách trường.' });
  }
};

// Lấy thông tin chi tiết một trường (Public)
export const getTruongById = async (req, res) => {
  try {
    const truong = await getTruongByIdService(req.params.id);
    res.status(200).json(truong);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi lấy chi tiết trường.';
    console.error("Lỗi khi lấy chi tiết trường (controller):", error);
    res.status(statusCode).json({ message });
  }
};

// Cập nhật thông tin trường (Admin)
export const updateTruong = async (req, res) => {
  try {
    const truong = await updateTruongService(req.params.id, req.body);
    res.status(200).json({ message: 'Cập nhật thông tin trường thành công', truong });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi cập nhật trường.';
    const response = { message };
    if (error.details) response.details = error.details;
    console.error("Lỗi khi cập nhật trường (controller):", error);
    res.status(statusCode).json(response);
  }
};

// Xóa trường (Admin)
export const deleteTruong = async (req, res) => {
  try {
    const result = await deleteTruongService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi xóa trường.';
    console.error("Lỗi khi xóa trường (controller):", error);
    res.status(statusCode).json({ message });
  }
}; 
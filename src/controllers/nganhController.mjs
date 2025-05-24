import {
  getAllNganhsService,
  getNganhByTruongService,
  getNganhByIdService,
  createNganhService,
  updateNganhService,
  deleteNganhService
} from '../services/nganh.service.mjs';

// Lấy danh sách tất cả các ngành (Public)
export const getAllNganhs = async (req, res) => {
  try {
    const nganhs = await getAllNganhsService();
    res.status(200).json(nganhs);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả các ngành (controller):", error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy tất cả các ngành.' });
  }
};

// Lấy danh sách ngành theo trường (Public) - giữ nguyên, chỉ cập nhật response lỗi
export const getNganhByTruong = async (req, res) => {
  try {
    const nganh = await getNganhByTruongService(req.params.truongId);
    res.json(nganh);
  } catch (error) {
    console.error("Lỗi khi lấy ngành theo trường (controller):", error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy danh sách ngành theo trường.' });
  }
};

// Lấy chi tiết một ngành (Public) - giữ nguyên, chỉ cập nhật response lỗi
export const getNganhById = async (req, res) => {
  try {
    const nganh = await getNganhByIdService(req.params.id);
    // Service đã xử lý lỗi 404, ở đây chỉ bắt lỗi chung từ service hoặc lỗi 500
    res.json(nganh);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi lấy chi tiết ngành.';
    console.error("Lỗi khi lấy chi tiết ngành (controller):", error);
    res.status(statusCode).json({ message });
  }
};

// Tạo ngành mới (Admin)
export const createNganh = async (req, res) => {
  try {
    const nganh = await createNganhService(req.body);
    res.status(201).json({ message: 'Tạo ngành mới thành công', nganh });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi tạo ngành.';
    const response = { message };
    if (error.details) response.details = error.details;
    console.error("Lỗi khi tạo ngành (controller):", error);
    res.status(statusCode).json(response);
  }
};

// Cập nhật thông tin ngành (Admin)
export const updateNganh = async (req, res) => {
  try {
    const nganh = await updateNganhService(req.params.id, req.body);
    res.status(200).json({ message: 'Cập nhật thông tin ngành thành công', nganh });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi cập nhật ngành.';
    const response = { message };
    if (error.details) response.details = error.details;
    console.error("Lỗi khi cập nhật ngành (controller):", error);
    res.status(statusCode).json(response);
  }
};

// Xóa ngành (Admin)
export const deleteNganh = async (req, res) => {
  try {
    const result = await deleteNganhService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi xóa ngành.';
    console.error("Lỗi khi xóa ngành (controller):", error);
    res.status(statusCode).json({ message });
  }
}; 
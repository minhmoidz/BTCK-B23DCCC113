import {
  getNganhByTruongService,
  getNganhByIdService,
  createNganhService,
  updateNganhService
} from '../services/nganh.service.mjs';

// Lấy danh sách ngành theo trường
export const getNganhByTruong = async (req, res) => {
  try {
    const nganh = await getNganhByTruongService(req.params.truongId);
    res.json(nganh);
  } catch (error) {
    // Log lỗi chi tiết ở service, ở đây chỉ trả về lỗi chung
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách ngành' });
  }
};

// Lấy chi tiết một ngành
export const getNganhById = async (req, res) => {
  try {
    const nganh = await getNganhByIdService(req.params.id);
    if (!nganh) {
      return res.status(404).json({ message: 'Không tìm thấy ngành học' });
    }
    res.json(nganh);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết ngành' });
  }
};

// Tạo ngành mới (cho admin)
export const createNganh = async (req, res) => {
  try {
    const nganh = await createNganhService(req.body);
    res.status(201).json(nganh);
  } catch (error) {
    // Lỗi từ service có thể là lỗi validation hoặc lỗi chung
    // Cân nhắc việc kiểm tra `error.message` để trả về status code phù hợp hơn nếu cần
    res.status(400).json({ message: error.message || 'Lỗi khi tạo ngành mới' });
  }
};

// Cập nhật thông tin ngành (cho admin)
export const updateNganh = async (req, res) => {
  try {
    const nganh = await updateNganhService(req.params.id, req.body);
    if (!nganh) {
      return res.status(404).json({ message: 'Không tìm thấy ngành học để cập nhật' });
    }
    res.json(nganh);
  } catch (error) {
    // Tương tự như createNganh, xử lý lỗi từ service
    res.status(400).json({ message: error.message || 'Lỗi khi cập nhật ngành' });
  }
}; 
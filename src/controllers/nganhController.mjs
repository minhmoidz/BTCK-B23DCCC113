import Nganh from '../models/Nganh.mjs';

// Lấy danh sách ngành theo trường
export const getNganhByTruong = async (req, res) => {
  try {
    const nganh = await Nganh.find({ truongId: req.params.truongId });
    res.json(nganh);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy chi tiết một ngành
export const getNganhById = async (req, res) => {
  try {
    const nganh = await Nganh.findById(req.params.id);
    if (!nganh) {
      return res.status(404).json({ message: 'Không tìm thấy ngành học' });
    }
    res.json(nganh);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Tạo ngành mới (cho admin)
export const createNganh = async (req, res) => {
  try {
    const nganh = new Nganh(req.body);
    await nganh.save();
    res.status(201).json(nganh);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật thông tin ngành (cho admin)
export const updateNganh = async (req, res) => {
  try {
    const nganh = await Nganh.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!nganh) {
      return res.status(404).json({ message: 'Không tìm thấy ngành học' });
    }
    res.json(nganh);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}; 
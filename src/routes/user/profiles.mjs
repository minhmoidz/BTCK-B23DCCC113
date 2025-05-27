import express from 'express';
import { authMiddleware } from '../../auth.mjs';
import { adminAuth } from './middleware/validation.mjs';
import Profile from '../../models/Profile.mjs';

const router = express.Router();

// --- API lấy hồ sơ của user ---
router.get('/hoso', authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const userProfiles = await Profile.find({ userId }).sort({ createdAt: -1 });
    res.json(userProfiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- API admin lấy danh sách hồ sơ ---
router.get('/admin/profiles', adminAuth, async (req, res) => {
  try {
    const { trangThai, phuongThuc, truong, nganh } = req.query;
    
    let query = {};
    
    if (trangThai) query.trangThai = trangThai;
    if (phuongThuc) query.phuongThuc = phuongThuc;
    if (truong) query.truong = truong;
    if (nganh) query.maNganh = nganh;
    
    const profiles = await Profile.find(query).sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- API admin cập nhật trạng thái hồ sơ ---
router.post('/admin/profiles/:id/status', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { trangThai, ghiChu } = req.body;

  if (!['duyet', 'tu_choi', 'yeu_cau_bo_sung', 'trung_tuyen'].includes(trangThai)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  try {
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
    }

    profile.trangThai = trangThai;
    profile.updatedAt = new Date();
    
    profile.lichSuTrangThai.push({
      trangThai,
      thoiGian: new Date(),
      ghiChu: ghiChu || `Cập nhật trạng thái thành ${trangThai}`
    });
    
    await profile.save();
    res.json({ message: `Đã cập nhật trạng thái thành ${trangThai}`, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

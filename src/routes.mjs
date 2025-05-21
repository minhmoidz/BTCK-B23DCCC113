// routes.mjs
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { safeFolderName } from './utils.mjs';
import { truongList, nganhList, toHopList } from './data.mjs';

const router = express.Router();

const dataDir = path.resolve('data');
const profilesPath = path.join(dataDir, 'profiles.json');

async function ensureFile(filePath, defaultContent = '[]') {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    await fsPromises.writeFile(filePath, defaultContent, 'utf-8');
  }
}

async function readProfiles() {
  await ensureFile(profilesPath);
  const data = await fsPromises.readFile(profilesPath, 'utf-8');
  return JSON.parse(data);
}

async function writeProfiles(profiles) {
  await ensureFile(profilesPath);
  await fsPromises.writeFile(profilesPath, JSON.stringify(profiles, null, 2), 'utf-8');
}

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/tmp');
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Không hỗ trợ định dạng file này'), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// --- API nộp hồ sơ xét tuyển ---
router.post('/xettuyen', upload.array('files', 3), async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Chưa xác thực' });
    }
    const userId = auth.slice(7).trim();

    const { truong, nganh, toHop, hoTen, ngaySinh, diemThi, doiTuongUuTien } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Thiếu userId' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Không có file nào được tải lên' });
    }

    // Tạo thư mục lưu file
    const folderName = safeFolderName(`${hoTen || 'user'}_${ngaySinh || Date.now()}`);
    const userDir = path.join('uploads', folderName);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const savedFiles = [];
    for (const file of req.files) {
      const destPath = path.join(userDir, Date.now() + '_' + safeFolderName(file.originalname));
      fs.renameSync(file.path, destPath);
      savedFiles.push(destPath);
    }

    // Lưu hồ sơ
    const profiles = await readProfiles();
    const newProfile = {
      id: uuidv4(),
      userId,
      truong,
      nganh,
      toHop,
      hoTen,
      ngaySinh,
      diemThi,
      doiTuongUuTien,
      files: savedFiles,
      trangThai: 'dang_duyet',
      createdAt: new Date().toISOString()
    };
    profiles.push(newProfile);
    await writeProfiles(profiles);

    res.json({ message: 'Hồ sơ đã nhận thành công!', data: newProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API lấy hồ sơ của user ---
router.get('/hoso', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Thiếu userId' });
  }
  const profiles = await readProfiles();
  const userProfiles = profiles.filter(p => p.userId === userId);
  res.json(userProfiles);
});

// --- Middleware giả lập xác thực admin ---
function adminAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  if (auth === 'Bearer admin-token') {
    next();
  } else {
    res.status(403).json({ error: 'Không có quyền truy cập' });
  }
}

// --- API quản trị viên lấy danh sách hồ sơ ---
router.get('/admin/profiles', adminAuth, async (req, res) => {
  const { trangThai } = req.query;
  const profiles = await readProfiles();
  const filtered = trangThai ? profiles.filter(p => p.trangThai === trangThai) : profiles;
  res.json(filtered);
});

// --- API quản trị viên cập nhật trạng thái hồ sơ ---
router.post('/admin/profiles/:id/status', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { trangThai } = req.body; // 'duyet' hoặc 'tu_choi'

  if (!['duyet', 'tu_choi'].includes(trangThai)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  const profiles = await readProfiles();
  const profile = profiles.find(p => p.id === id);
  if (!profile) {
    return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
  }

  profile.trangThai = trangThai;
  profile.updatedAt = new Date().toISOString();

  await writeProfiles(profiles);

  res.json({ message: `Đã cập nhật trạng thái thành ${trangThai}`, profile });
});

// --- API lấy danh sách trường, ngành, tổ hợp ---
router.get('/truong', (req, res) => {
  res.json(truongList);
});
router.get('/nganh/:truongKey', (req, res) => {
  const { truongKey } = req.params;
  res.json(nganhList[truongKey] || []);
});
router.get('/tohop/:truongKey/:nganhKey', (req, res) => {
  const { truongKey, nganhKey } = req.params;
  res.json((toHopList[truongKey] && toHopList[truongKey][nganhKey]) || []);
});

export default router;

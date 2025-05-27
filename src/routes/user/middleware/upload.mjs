import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const tmpDir = 'uploads/tmp';
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    cb(null, tmpDir);
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

// Cấu hình upload cho nhiều trường file
export const uploadFields = upload.fields([
  { name: 'anhChanDung', maxCount: 1 },
  { name: 'cccd', maxCount: 1 },
  { name: 'hocBa', maxCount: 1 },
  { name: 'bangDiem', maxCount: 1 },
  { name: 'bangTotNghiep', maxCount: 1 },
  { name: 'giayChungNhanUuTien', maxCount: 1 },
  { name: 'giayChungNhanGiaiThuong', maxCount: 1 },
  { name: 'ketQuaDanhGiaNangLuc', maxCount: 1 },
  { name: 'chungChiNangKhieu', maxCount: 1 }
]);

export default upload;

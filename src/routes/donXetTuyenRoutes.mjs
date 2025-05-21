// --- START OF FILE donXetTuyenRoutes.mjs ---

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Thêm module fs để kiểm tra/tạo thư mục
import { fileURLToPath } from 'url'; // Để sử dụng __dirname trong ES Modules

import {
  submitDonXetTuyen,
  getDonXetTuyenByUser,
  updateTrangThaiDon,
  getDonXetTuyenById
} from '../controllers/donXetTuyenController.mjs'; // Đảm bảo đường dẫn tới controller là chính xác

const router = express.Router();

// ----- Cấu hình đường dẫn và tạo thư mục upload -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Giả sử thư mục 'uploads' nằm ở thư mục gốc của dự án.
// Và file route này nằm trong thư mục 'routes'.
// Đường dẫn đến thư mục gốc của dự án: path.join(__dirname, '..')
// Đường dẫn đến thư mục minhchung: path.join(__dirname, '..', 'uploads', 'minhchung')
const UPLOAD_FOLDER_PATH = path.join(__dirname, '..', 'uploads', 'minhchung');

// Tạo thư mục uploads/minhchung nếu nó chưa tồn tại
if (!fs.existsSync(UPLOAD_FOLDER_PATH)) {
  try {
    fs.mkdirSync(UPLOAD_FOLDER_PATH, { recursive: true });
    console.log(`Thư mục upload đã được tạo: ${UPLOAD_FOLDER_PATH}`);
  } catch (err) {
    console.error(`Lỗi khi tạo thư mục upload ${UPLOAD_FOLDER_PATH}:`, err);
    // Cân nhắc việc dừng ứng dụng hoặc xử lý lỗi khác nếu không thể tạo thư mục
  }
} else {
  console.log(`Thư mục upload đã tồn tại: ${UPLOAD_FOLDER_PATH}`);
}

// ----- Cấu hình multer để upload file -----
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER_PATH); // Sử dụng đường dẫn đã được xác định và tạo
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất để tránh ghi đè và các vấn đề bảo mật tiềm ẩn
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Bộ lọc file: Chỉ cho phép các loại file nhất định
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Chấp nhận file
  } else {
    // Từ chối file và trả về lỗi cho multer
    // Lỗi này có thể được bắt trong middleware xử lý lỗi của Express hoặc trong controller
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname), false);
    // Hoặc: cb(new Error('Loại file không hợp lệ. Chỉ chấp nhận JPG, PNG, PDF, DOC, DOCX.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Giới hạn kích thước file là 10MB
  }
});

/**
 * @swagger
 * /api/don-xet-tuyen/submit:
 *   post:
 *     summary: Nộp đơn xét tuyển
 *     tags: [Đơn xét tuyển]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object # Sửa lại schema cho Swagger để phản ánh đúng request body
 *             required: # Liệt kê các trường bắt buộc trong form body
 *               - userId
 *               - hoTen
 *               - sdt
 *               - email
 *               - ngaySinh
 *               - truongId
 *               - nganhId
 *               - phuongThucXetTuyen
 *               - doiTuongUuTien
 *             properties:
 *               userId:
 *                 type: string
 *               hoTen:
 *                 type: string
 *               sdt:
 *                 type: string
 *               email:
 *                 type: string
 *               ngaySinh:
 *                 type: string
 *                 format: date
 *               trangThai: # Trang thái thường do backend quyết định hoặc có giá trị default
 *                  type: string
 *                  enum: [dang_duyet]
 *                  default: dang_duyet
 *                  readOnly: true # Cho biết client không nên gửi trường này
 *               truongId:
 *                 type: string
 *               nganhId:
 *                 type: string
 *               phuongThucXetTuyen:
 *                 type: string
 *                 enum: [diem_thi, hoc_ba, tsa]
 *               toHopXetTuyen: # Chỉ bắt buộc nếu phuongThucXetTuyen là 'diem_thi'
 *                 type: string
 *               diemThi: # Chỉ bắt buộc nếu phuongThucXetTuyen là 'diem_thi' hoặc 'tsa'
 *                 type: number
 *               diemHocBa: # Chỉ bắt buộc nếu phuongThucXetTuyen là 'hoc_ba'
 *                 type: number
 *               doiTuongUuTien:
 *                 type: string
 *                 enum: [Khu vực 1, Khu vực 2, Khu vực 2 nông thôn, Khu vực 3]
 *               minhChungFiles: # Đổi tên trường này để rõ ràng hơn là file upload
 *                               # Và khớp với tên field trong upload.array()
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Tối đa 5 file minh chứng. Tên field phải là 'minhChungFiles'."
 *     responses:
 *       201:
 *         description: Nộp đơn thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc lỗi upload (file quá lớn, sai loại file)
 *       500:
 *         description: Lỗi server
 */
// Tên 'minhChungFiles' trong upload.array() phải khớp với thuộc tính 'name'
// của input type="file" ở frontend.
router.post('/submit', upload.array('minhChungFiles', 5), submitDonXetTuyen);

/**
 * @swagger
 * /api/don-xet-tuyen/user/{userId}:
 *   get:
 *     summary: Lấy danh sách đơn xét tuyển của user
 *     tags: [Đơn xét tuyển]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách đơn xét tuyển
 */
router.get('/user/:userId', getDonXetTuyenByUser);

/**
 * @swagger
 * /api/don-xet-tuyen/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái đơn xét tuyển
 *     tags: [Đơn xét tuyển]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trangThai
 *             properties:
 *               trangThai:
 *                 type: string
 *                 enum: [dang_duyet, da_duyet, bi_tu_choi, can_bo_sung, da_rut] # Đồng bộ với schema DonXetTuyen
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch('/:id/status', updateTrangThaiDon);

/**
 * @swagger
 * /api/don-xet-tuyen/{id}:
 *   get:
 *     summary: Lấy chi tiết một đơn xét tuyển
 *     tags: [Đơn xét tuyển]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết đơn xét tuyển
 *       404:
 *         description: Không tìm thấy đơn xét tuyển
 */
router.get('/:id', getDonXetTuyenById);

export default router;
// --- END OF FILE donXetTuyenRoutes.mjs ---
import express from 'express';
import { 
    createNotification,
    updateNotification,
    togglePinNotification,
    deleteNotification,
    getAdminNotifications
} from '../../controllers/admin.controller.mjs';
import { verifyToken, isAdmin } from '../../middleware/auth.middleware.mjs';

const router = express.Router();

// Áp dụng middleware xác thực và phân quyền admin cho tất cả các routes
router.use(verifyToken, isAdmin);

// Tạo thông báo mới
router.post('/', createNotification);

// Lấy danh sách thông báo (có lọc và phân trang)
router.get('/', getAdminNotifications);

// Cập nhật thông báo
router.put('/:id', updateNotification);

// Ghim/bỏ ghim thông báo
router.patch('/:id/toggle-pin', togglePinNotification);

// Xóa thông báo
router.delete('/:id', deleteNotification);

export default router; 
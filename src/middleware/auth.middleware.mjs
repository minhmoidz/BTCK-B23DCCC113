import jwt from 'jsonwebtoken';
import User from '../models/User.mjs'; // Cần thiết để kiểm tra user có tồn tại không (tùy chọn thêm)

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header (loại bỏ chữ 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Xác thực token
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error('Lỗi: JWT_SECRET chưa được định nghĩa trong biến môi trường.');
        return res.status(500).json({ message: 'Lỗi cấu hình server.' });
      }
      const decoded = jwt.verify(token, JWT_SECRET);

      // Gắn thông tin user (không bao gồm password) vào req
      // req.user = await User.findById(decoded.userId).select('-password'); 
      // Hoặc đơn giản hơn nếu chỉ cần id, email, role từ token:
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };

      if (!req.user.userId) {
          // Trường hợp token hợp lệ nhưng không tìm thấy user (đã bị xóa chẳng hạn)
          // Điều này ít xảy ra nếu token payload chứa đủ thông tin cần thiết
          return res.status(401).json({ message: 'Người dùng không tồn tại hoặc token không hợp lệ.'});
      }

      next(); // Chuyển sang middleware hoặc controller tiếp theo
    } catch (error) {
      console.error('Lỗi xác thực token:', error.message);
      // Các lỗi có thể là TokenExpiredError, JsonWebTokenError (sai định dạng, sai secret)
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token đã hết hạn. Vui lòng đăng nhập lại.' });
      }
      return res.status(401).json({ message: 'Không được phép, token không hợp lệ.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Không được phép, không tìm thấy token.' });
  }
};

// Middleware để kiểm tra vai trò (ví dụ: chỉ admin)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Yêu cầu xác thực để thực hiện hành động này.'});
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Vai trò người dùng (${req.user.role}) không được phép truy cập tài nguyên này.`
      });
    }
    next();
  };
}; 
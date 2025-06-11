// Middleware xác thực admin
export const adminAuth = (req, res, next) => {
  // Tạm thời bỏ qua kiểm tra token
  next();
};

// Validation cho phương thức xét tuyển
export const validateAdmissionMethod = (req, res, next) => {
const { phuongThuc } = req.params;
const phuongThucHopLe = ['tsa', 'hsa', 'thpt', 'dgnl', 'xthb'];

if (!phuongThucHopLe.includes(phuongThuc)) {
  return res.status(400).json({ error: 'Phương thức xét tuyển không hợp lệ' });
}

next();
};

// Validation cho trường bắt buộc
export const validateRequiredFields = (requiredFields) => {
return (req, res, next) => {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Thiếu thông tin bắt buộc: ${field}` });
    }
  }
  next();
};
}; 
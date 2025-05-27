import express from 'express';
import { getPhuongThucName } from '../../utils/utils.mjs';

const router = express.Router();

// --- API lấy danh sách phương thức xét tuyển ---
router.get('/phuongthuc-xettuyen', (req, res) => {
  const phuongThucList = [
    { code: 'tsa', name: 'Xét tuyển thẳng', description: 'Dành cho thí sinh đạt giải trong các kỳ thi học sinh giỏi' },
    { code: 'hsa', name: 'Xét tuyển học bạ', description: 'Xét tuyển dựa trên kết quả học tập THPT' },
    { code: 'thpt', name: 'Xét tuyển điểm thi THPT', description: 'Xét tuyển dựa trên kết quả kỳ thi THPT Quốc gia' },
    { code: 'dgnl', name: 'Đánh giá năng lực', description: 'Xét tuyển dựa trên kết quả bài thi đánh giá năng lực' },
    { code: 'xthb', name: 'Xét tuyển kết hợp', description: 'Kết hợp điểm học tập và năng khiếu chuyên biệt' }
  ];
  
  res.json(phuongThucList);
});

// --- API lấy thông tin yêu cầu của từng phương thức xét tuyển ---
router.get('/phuongthuc-xettuyen/:phuongThuc/requirements', (req, res) => {
  const { phuongThuc } = req.params;
  
  const phuongThucHopLe = ['tsa', 'hsa', 'thpt', 'dgnl', 'xthb'];
  if (!phuongThucHopLe.includes(phuongThuc)) {
    return res.status(400).json({ error: 'Phương thức xét tuyển không hợp lệ' });
  }
  
  const requirementsMap = {
    'thpt': {
      fields: [
        { name: 'toHop', label: 'Tổ hợp môn', type: 'select', required: true },
        { name: 'tenMon1', label: 'Môn 1', type: 'text', required: true },
        { name: 'diemMon1', label: 'Điểm môn 1', type: 'number', required: true },
        { name: 'tenMon2', label: 'Môn 2', type: 'text', required: true },
        { name: 'diemMon2', label: 'Điểm môn 2', type: 'number', required: true },
        { name: 'tenMon3', label: 'Môn 3', type: 'text', required: true },
        { name: 'diemMon3', label: 'Điểm môn 3', type: 'number', required: true },
        { name: 'doiTuongUuTien', label: 'Đối tượng ưu tiên', type: 'select', required: false },
        { name: 'khuVucUuTien', label: 'Khu vực ưu tiên', type: 'select', required: false },
        { name: 'diemUuTien', label: 'Điểm ưu tiên', type: 'number', required: false }
      ],
      files: [
        { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
        { name: 'cccd', label: 'CCCD/CMND', required: true },
        { name: 'bangDiem', label: 'Bảng điểm THPT', required: true },
        { name: 'giayChungNhanUuTien', label: 'Giấy chứng nhận ưu tiên (nếu có)', required: false }
      ]
    },
    'hsa': {
      fields: [
        { name: 'diemTBLop11', label: 'Điểm TB lớp 11', type: 'number', required: true },
        { name: 'diemTBLop12', label: 'Điểm TB lớp 12', type: 'number', required: true },
        { name: 'diemTBMonHoc', label: 'Điểm TB các môn xét tuyển', type: 'number', required: true },
        { name: 'cacMonXetTuyen', label: 'Các môn xét tuyển', type: 'textarea', required: true, 
          description: 'Nhập danh sách môn học và điểm dạng JSON: [{"mon":"Toán","diem":8.5},...]' }
      ],
      files: [
        { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
        { name: 'cccd', label: 'CCCD/CMND', required: true },
        { name: 'hocBa', label: 'Học bạ THPT', required: true },
        { name: 'bangTotNghiep', label: 'Bằng tốt nghiệp THPT', required: true }
      ]
    },
    'tsa': {
      fields: [
        { name: 'loaiGiaiThuong', label: 'Loại giải thưởng', type: 'select', required: true,
          options: ['Học sinh giỏi Quốc gia', 'Olympic Quốc tế', 'Cuộc thi Khoa học kỹ thuật', 'Khác'] },
        { name: 'capGiaiThuong', label: 'Cấp giải thưởng', type: 'select', required: true,
          options: ['Quốc tế', 'Quốc gia', 'Tỉnh/Thành phố'] },
        { name: 'tenGiaiThuong', label: 'Tên giải thưởng', type: 'text', required: true },
        { name: 'namDoatGiai', label: 'Năm đoạt giải', type: 'number', required: true }
      ],
      files: [
        { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
        { name: 'cccd', label: 'CCCD/CMND', required: true },
        { name: 'bangTotNghiep', label: 'Bằng tốt nghiệp THPT', required: true },
        { name: 'giayChungNhanGiaiThuong', label: 'Giấy chứng nhận giải thưởng', required: true }
      ]
    },
    'dgnl': {
      fields: [
        { name: 'diemDanhGiaNangLuc', label: 'Điểm đánh giá năng lực', type: 'number', required: true },
        { name: 'ngayThi', label: 'Ngày thi', type: 'date', required: true },
        { name: 'noiThi', label: 'Nơi thi', type: 'text', required: true },
        { name: 'soBaoDanh', label: 'Số báo danh', type: 'text', required: true }
      ],
      files: [
        { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
        { name: 'cccd', label: 'CCCD/CMND', required: true },
        { name: 'ketQuaDanhGiaNangLuc', label: 'Kết quả đánh giá năng lực', required: true }
      ]
    },
    'xthb': {
      fields: [
        { name: 'diemTBHocTap', label: 'Điểm TB học tập', type: 'number', required: true },
        { name: 'diemNangKhieu', label: 'Điểm năng khiếu', type: 'number', required: true },
        { name: 'loaiNangKhieu', label: 'Loại năng khiếu', type: 'select', required: true,
          options: ['Nghệ thuật', 'Thể thao', 'Ngoại ngữ', 'Tin học', 'Khác'] },
        { name: 'diemPhongVan', label: 'Điểm phỏng vấn', type: 'number', required: false },
        { name: 'ngayPhongVan', label: 'Ngày phỏng vấn', type: 'date', required: false }
      ],
      files: [
        { name: 'anhChanDung', label: 'Ảnh chân dung', required: true },
        { name: 'cccd', label: 'CCCD/CMND', required: true },
        { name: 'hocBa', label: 'Học bạ THPT', required: true },
        { name: 'chungChiNangKhieu', label: 'Chứng chỉ năng khiếu', required: true }
      ]
    }
  };
  
  res.json({
    phuongThuc,
    tenPhuongThuc: getPhuongThucName(phuongThuc),
    requirements: requirementsMap[phuongThuc]
  });
});

export default router;

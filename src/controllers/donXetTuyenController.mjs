// --- START OF FILE donXetTuyenController.mjs ---

import DonXetTuyen from '../models/DonXetTuyen.mjs';
import Nganh from '../models/Nganh.mjs';
import fs from 'fs'; // Thêm module fs để xóa file nếu có lỗi
import multer from 'multer'; // Import multer để có thể check instanceof MulterError

// Nộp đơn xét tuyển
export const submitDonXetTuyen = async (req, res) => {
  try {
    const {
      userId,
      hoTen,
      sdt,
      email,
      ngaySinh,
      truongId,
      nganhId,
      phuongThucXetTuyen,
      toHopXetTuyen, // Sẽ được gửi từ frontend nếu PTXT là 'diem_thi'
      diemThi,       // Sẽ được gửi từ frontend nếu PTXT là 'diem_thi' hoặc 'tsa'
      diemHocBa,     // Sẽ được gửi từ frontend nếu PTXT là 'hoc_ba'
      doiTuongUuTien
    } = req.body;

    // 1. Kiểm tra ngành có tồn tại và có phương thức xét tuyển phù hợp không
    const nganh = await Nganh.findById(nganhId);
    if (!nganh) {
      // Nếu ngành không tồn tại, xóa file đã upload (nếu có)
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(404).json({ message: 'Không tìm thấy ngành học' });
    }

    if (!nganh.phuongThucXetTuyen.includes(phuongThucXetTuyen)) {
      // Nếu PTXT không hợp lệ, xóa file đã upload (nếu có)
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(400).json({ message: 'Phương thức xét tuyển không hợp lệ cho ngành này' });
    }

    // 2. Xử lý file minh chứng
    const minhChungData = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        minhChungData.push({
          tenFile: file.originalname,
          // Lưu đường dẫn tương đối, có thể truy cập từ client, dựa trên cấu hình static
          // Ví dụ: /uploads/minhchung/ten_file_unique.pdf
          duongDan: `/uploads/minhchung/${file.filename}`,
          loaiFile: file.mimetype
        });
      });
    }

    // 3. Tạo đối tượng DonXetTuyen
    const donXetTuyenData = {
      userId,
      hoTen,
      sdt,
      email,
      ngaySinh,
      truongId,
      nganhId,
      phuongThucXetTuyen,
      doiTuongUuTien,
      minhChung: minhChungData
    };

    // Thêm các trường có điều kiện
    if (phuongThucXetTuyen === 'diem_thi') {
      if (!toHopXetTuyen) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        return res.status(400).json({ message: 'Tổ hợp xét tuyển là bắt buộc cho phương thức điểm thi.' });
      }
      if (diemThi === undefined || diemThi === null || isNaN(parseFloat(diemThi))) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        return res.status(400).json({ message: 'Điểm thi là bắt buộc và phải là số cho phương thức điểm thi.' });
      }
      donXetTuyenData.toHopXetTuyen = toHopXetTuyen;
      donXetTuyenData.diemThi = Number(diemThi);
    } else if (phuongThucXetTuyen === 'tsa') {
      if (diemThi === undefined || diemThi === null || isNaN(parseFloat(diemThi))) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        return res.status(400).json({ message: 'Điểm thi TSA là bắt buộc và phải là số.' });
      }
      donXetTuyenData.diemThi = Number(diemThi);
    } else if (phuongThucXetTuyen === 'hoc_ba') {
      if (diemHocBa === undefined || diemHocBa === null || isNaN(parseFloat(diemHocBa))) {
         if (req.files && req.files.length > 0) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        return res.status(400).json({ message: 'Điểm học bạ là bắt buộc và phải là số.' });
      }
      donXetTuyenData.diemHocBa = Number(diemHocBa);
      // Kiểm tra minh chứng bắt buộc cho học bạ (dù schema có thể đã check)
      if (minhChungData.length === 0) {
        // Không cần xóa file ở đây vì nếu minhChungData rỗng thì req.files cũng rỗng
        // hoặc file đã bị filter loại bỏ trước đó bởi multer.
        return res.status(400).json({ message: 'Minh chứng là bắt buộc cho phương thức xét tuyển học bạ.' });
      }
    }

    const donXetTuyen = new DonXetTuyen(donXetTuyenData);

    // 4. Lưu vào cơ sở dữ liệu
    await donXetTuyen.save(); // Validation của Mongoose (bao gồm pre-validate) sẽ chạy ở đây
    res.status(201).json({ message: 'Nộp đơn thành công', donXetTuyen });

  } catch (error) {
    // Xóa các file đã upload nếu có lỗi xảy ra
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path); // file.path là đường dẫn multer đã lưu trên server
        } catch (e) {
          console.error("Lỗi khi dọn dẹp file sau khi có lỗi controller:", e);
        }
      });
    }

    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    if (error instanceof multer.MulterError) {
      // Xử lý các lỗi cụ thể của Multer từ route (ví dụ: fileFilter, limits)
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File quá lớn. Kích thước tối đa là 10MB.' });
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') { // Lỗi này từ fileFilter trong route
        return res.status(400).json({ message: 'Loại file không hợp lệ. Vui lòng kiểm tra lại.' });
      }
      // Các lỗi multer khác
      return res.status(400).json({ message: `Lỗi upload file: ${error.message}` });
    }
    // Lỗi này có thể do `cb(new Error('...'))` trong fileFilter của route
    if (error.message && (error.message.includes('Loại file không hợp lệ') || error.message.includes('Lỗi: Chỉ cho phép upload'))) {
        return res.status(400).json({ message: error.message });
    }

    console.error("Lỗi server khi nộp đơn:", error);
    res.status(500).json({ message: 'Lỗi server', errorDetails: error.message });
  }
};

// Lấy danh sách đơn xét tuyển của user
export const getDonXetTuyenByUser = async (req, res) => {
  try {
    const donXetTuyenList = await DonXetTuyen.find({ userId: req.params.userId })
      .populate('truongId', 'tenTruong maTruong') // Chỉ lấy các trường cần thiết từ Trường
      .populate('nganhId', 'tenNganh maNganh');    // Chỉ lấy các trường cần thiết từ Ngành
    res.json(donXetTuyenList);
  } catch (error) {
    console.error("Lỗi khi lấy đơn xét tuyển của user:", error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật trạng thái đơn xét tuyển
export const updateTrangThaiDon = async (req, res) => {
  try {
    const { trangThai } = req.body;
    if (!trangThai) {
        return res.status(400).json({ message: "Trạng thái là bắt buộc."});
    }
    // Kiểm tra xem trangThai có nằm trong enum của schema không
    const validStatuses = DonXetTuyen.schema.path('trangThai').enumValues;
    if (!validStatuses.includes(trangThai)) {
        return res.status(400).json({ message: `Trạng thái không hợp lệ. Các trạng thái hợp lệ là: ${validStatuses.join(', ')}`});
    }

    const donXetTuyen = await DonXetTuyen.findByIdAndUpdate(
      req.params.id,
      { trangThai, updatedAt: Date.now() }, // updatedAt sẽ được cập nhật bởi pre('save') hoặc pre('findOneAndUpdate') nếu bạn thêm
      { new: true, runValidators: true } // runValidators để đảm bảo trangThai hợp lệ
    );

    if (!donXetTuyen) {
      return res.status(404).json({ message: 'Không tìm thấy đơn xét tuyển để cập nhật' });
    }
    res.json(donXetTuyen);
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    console.error("Lỗi khi cập nhật trạng thái đơn:", error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy chi tiết một đơn xét tuyển
export const getDonXetTuyenById = async (req, res) => {
  try {
    const donXetTuyen = await DonXetTuyen.findById(req.params.id)
      .populate('truongId', 'tenTruong maTruong website diaChi')
      .populate('nganhId', 'tenNganh maNganh chiTieu phuongThucXetTuyen toHopXetTuyen');
    if (!donXetTuyen) {
      return res.status(404).json({ message: 'Không tìm thấy đơn xét tuyển' });
    }
    res.json(donXetTuyen);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn xét tuyển:", error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// --- END OF FILE donXetTuyenController.mjs ---
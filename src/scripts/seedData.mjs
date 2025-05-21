import mongoose from 'mongoose';
import Nganh from '../models/Nganh.mjs';
import DonXetTuyen from '../models/DonXetTuyen.mjs';
import Truong from '../models/Truong.mjs';
import connectDB from '../config/database.mjs';


const truongData = [
  {
    tenTruong: "Đại học Bách Khoa Hà Nội",
    maTruong: "HUST",
    diaChi: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
    website: "https://www.hust.edu.vn"
  },
  {
    tenTruong: "Đại học Kinh tế Quốc dân",
    maTruong: "NEU",
    diaChi: "207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội",
    website: "https://www.neu.edu.vn"
  },
  {
    tenTruong: "Đại học Công nghệ - ĐHQGHN",
    maTruong: "UET",
    diaChi: "E3, 144 Xuân Thủy, Cầu Giấy, Hà Nội",
    website: "https://uet.vnu.edu.vn"
  }
];

const nganhData = [
  {
    tenNganh: "Công nghệ thông tin",
    maNganh: "CNTT",
    truongId: null, // Sẽ được cập nhật sau khi tạo trường
    phuongThucXetTuyen: ["diem_thi", "hoc_ba"],
    toHopXetTuyen: ["A00", "A01", "D01"],
    chiTieu: 200
  },
  {
    tenNganh: "Điện tử viễn thông",
    maNganh: "DTVT",
    truongId: null, // Sẽ được cập nhật sau khi tạo trường
    phuongThucXetTuyen: ["diem_thi", "tsa"],
    toHopXetTuyen: ["A00", "A01"],
    chiTieu: 150
  },
  {
    tenNganh: "Kinh tế quốc dân",
    maNganh: "KTQD",
    truongId: null, // Sẽ được cập nhật sau khi tạo trường
    phuongThucXetTuyen: ["diem_thi", "hoc_ba"],
    toHopXetTuyen: ["A00", "A01", "D01"],
    chiTieu: 300
  },
  {
    tenNganh: "Kinh tế quốc tế",
    maNganh: "KTQT",
    truongId: null, // Sẽ được cập nhật sau khi tạo trường
    phuongThucXetTuyen: ["diem_thi", "hoc_ba"],
    toHopXetTuyen: ["A01", "D01"],
    chiTieu: 250
  }
];

const donXetTuyenData = [
  {
    userId: "user123",
    hoTen: "Nguyễn Văn A",
    sdt: "0987654321",
    email: "nguyenvana@example.com",
    ngaySinh: new Date("2000-01-01"),
    truongId: null, // Sẽ được cập nhật sau khi tạo trường
    nganhId: null, // Sẽ được cập nhật sau khi tạo ngành
    phuongThucXetTuyen: "diem_thi",
    toHopXetTuyen: "A00",
    diemThi: 25.5,
    doiTuongUuTien: "Khu vực 1",
    trangThai: "dang_duyet"
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Xóa dữ liệu cũ
    await Truong.deleteMany({});
    await Nganh.deleteMany({});
    await DonXetTuyen.deleteMany({});
    
    // Thêm dữ liệu trường mới
    const createdTruong = await Truong.insertMany(truongData);
    console.log('Đã thêm dữ liệu trường thành công!');
    
    // Cập nhật truongId trong ngành
    nganhData[0].truongId = createdTruong[0]._id; // CNTT - HUST
    nganhData[1].truongId = createdTruong[0]._id; // DTVT - HUST
    nganhData[2].truongId = createdTruong[1]._id; // KTQD - NEU
    nganhData[3].truongId = createdTruong[1]._id; // KTQT - NEU
    
    // Thêm dữ liệu ngành mới
    const createdNganh = await Nganh.insertMany(nganhData);
    console.log('Đã thêm dữ liệu ngành thành công!');
    
    // Cập nhật truongId và nganhId trong đơn xét tuyển
    donXetTuyenData[0].truongId = createdTruong[0]._id;
    donXetTuyenData[0].nganhId = createdNganh[0]._id;
    
    // Thêm dữ liệu đơn xét tuyển
    await DonXetTuyen.insertMany(donXetTuyenData);
    console.log('Đã thêm dữ liệu đơn xét tuyển thành công!');
    
    console.log('Dữ liệu mẫu đã được thêm thành công!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu mẫu:', error);
    process.exit(1);
  }
};

seedData(); 
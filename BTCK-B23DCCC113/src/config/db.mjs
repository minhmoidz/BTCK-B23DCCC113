import mongoose from "mongoose";

// Chuỗi kết nối MongoDB Atlas
const MONGODB_URI = "mongodb+srv://minhtuantran210305:minhdz@tuyensinh.s1j9usk.mongodb.net/?retryWrites=true&w=majority&appName=tuyensinh";

// Kết nối đến MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Kết nối MongoDB Atlas thành công!");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;

import mongoose from "mongoose";

// Chuỗi kết nối MongoDB Atlas
const MONGODB_URI = "mongodb://localhost:27017/";

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

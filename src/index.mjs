// server.js
import express from 'express';
import cors from 'cors';
import { router as authRouter } from './auth.mjs';
import { router as mainRouter } from './routes/user/index.mjs';
import { router as adminRouter } from './routes/admin.mjs';
import { router as publicRoutes } from './routes/public/index.mjs';
import fs from 'fs';
import path from 'path';
import connectDB from './data/db.mjs';

// Kết nối đến MongoDB Atlas
connectDB();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(process.cwd(), 'uploads');
const uploadsTmpDir = path.join(uploadsDir, 'tmp');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(uploadsTmpDir)) {
  fs.mkdirSync(uploadsTmpDir, { recursive: true });
}

app.use('/api/auth', authRouter); app.use('/api', mainRouter); 
app.use('/api', publicRoutes); // API public cho trường, ngành, tổ hợp 
app.use('/api/admin', adminRouter); 
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

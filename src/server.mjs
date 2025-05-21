import express from 'express';
import authRouter from './auth.mjs';
import mainRouter from './routes.mjs';
import donXetTuyenRouter from './routes/donXetTuyenRoutes.mjs';
import nganhRouter from './routes/nganhRoutes.mjs';
import cors from 'cors';
import connectDB from './config/database.mjs';
import { specs } from './config/swagger.mjs';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Kết nối MongoDB
connectDB();

app.use(cors({
  origin: '*', // hoặc bạn có thể thay bằng domain frontend cụ thể khi deploy
  credentials: true,
}));

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync('uploads/minhchung')) {
  fs.mkdirSync('uploads/minhchung', { recursive: true });

}

const PUBLIC_UPLOADS_DIR = path.join(__dirname, 'uploads'); // Nếu 'uploads' nằm cùng cấp với app.mjs

app.use('/uploads', express.static(PUBLIC_UPLOADS_DIR));
app.use('/api/auth', authRouter);    // Đăng ký, đăng nhập, OTP
app.use('/api', mainRouter);         // Các API còn lại
app.use('/api/don-xet-tuyen', donXetTuyenRouter); // API đơn xét tuyển
app.use('/api/nganh', nganhRouter);  // API ngành học

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
import authRouter from './auth.mjs';
import mainRouter from './routes.mjs';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: '*', // hoặc bạn có thể thay bằng domain frontend cụ thể khi deploy
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRouter);    // Đăng ký, đăng nhập, OTP
app.use('/api', mainRouter);         // Các API còn lại

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

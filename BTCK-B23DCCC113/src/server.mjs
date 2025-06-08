// server.js - File máy chủ chính của ứng dụng
import express from 'express';
import cors from 'cors';
import { router as authRouter } from './auth.mjs'; // Tuyến đường cho xác thực người dùng
import { router as mainRouter } from './routes/user/index.mjs'; // Tuyến đường chính cho người dùng đã đăng nhập
import { router as adminRouter } from './routes/admin/admin.routes.mjs'; // Tuyến đường cho quản trị viên
import { router as publicRoutes } from './routes/public/index.mjs'; // Tuyến đường công khai (danh sách trường, ngành,...)
import { chanceRoutes } from './routes/chance.routes.mjs'; // Sửa ở đây: import đúng tên đã export
import fs from 'fs';
import path from 'path';
import connectDB from './config/db.mjs'; // Hàm kết nối cơ sở dữ liệu

// Thêm import cho Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Thực hiện kết nối đến MongoDB Atlas
connectDB();

const app = express();

// Sử dụng CORS để cho phép truy cập từ các domain khác nhau
app.use(cors({
  origin: '*', // Cho phép tất cả các origin (nên cấu hình cụ thể hơn trong production)
  credentials: true,
}));

// Middleware để parse JSON từ request body
app.use(express.json());

// Đảm bảo thư mục `uploads` và `uploads/tmp` tồn tại để lưu file tải lên
const uploadsDir = path.join(process.cwd(), 'uploads');
const uploadsTmpDir = path.join(uploadsDir, 'tmp');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(uploadsTmpDir)) {
  fs.mkdirSync(uploadsTmpDir, { recursive: true });
}

// Cấu hình Swagger JSDoc
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Xét tuyển Đại học',
      version: '1.0.0',
      description: 'Hệ thống API cho ứng dụng hỗ trợ xét tuyển đại học',
      contact: {
        name: 'Nhóm Phát triển API',
        email: 'minhtuantran210305@gmail.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000', // Cập nhật nếu server của bạn chạy ở URL khác
        description: 'Development server'
      }
    ],
    // Định nghĩa API trực tiếp nếu JSDoc không hoạt động như mong đợi
    paths: {
      '/api/chance/schools': {
        post: {
          tags: ['Chance - Schools'],
          summary: 'Thêm một trường mới vào danh sách xét khả năng (Định nghĩa trực tiếp)',
          description: 'Tạo một trường mới để sử dụng trong tính năng tính toán khả năng trúng tuyển.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id', 'name'],
                  properties: {
                    id: { type: 'string', description: 'Mã trường duy nhất (ví dụ: HUST, VNU).' },
                    name: { type: 'string', description: 'Tên đầy đủ của trường.' }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Trường đã được tạo thành công.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ChanceSchool'
                  }
                }
              }
            },
            '400': { description: 'Dữ liệu không hợp lệ (thiếu ID hoặc tên).' },
            '409': { description: 'Trường với ID này đã tồn tại.' },
            '500': { description: 'Lỗi server.' }
          }
        }
        // Nếu bạn có API GET /api/chance/schools, bạn cũng có thể định nghĩa nó ở đây
        // get: { ... }
      }
    },
    components: {
      schemas: {
        ChanceSchool: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'MongoDB ObjectID' },
            id: { type: 'string', description: 'Mã trường duy nhất' },
            name: { type: 'string', description: 'Tên đầy đủ của trường' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        SubjectCombination: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Mã tổ hợp' },
            subjects: { type: 'array', items: { type: 'string' }, description: 'Danh sách môn' }
          }
        },
        ChanceMajor: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'MongoDB ObjectID' },
            schoolId: { type: 'string', description: 'ID của trường (tham chiếu ChanceSchool.id)' },
            sequenceNumber: { type: 'number', description: 'Số thứ tự ngành' },
            majorCode: { type: 'string', description: 'Mã ngành' },
            name: { type: 'string', description: 'Tên ngành' },
            subjectCombinations: { type: 'array', items: { $ref: '#/components/schemas/SubjectCombination' } },
            benchmarkThpt: { type: 'number', nullable: true },
            benchmarkDgnlHn30: { type: 'number', nullable: true },
            benchmarkDgnlHcm30: { type: 'number', nullable: true },
            benchmarkDgnlHn150: { type: 'number', nullable: true },
            benchmarkDgnlHcm150: { type: 'number', nullable: true },
            benchmarkDgtd: { type: 'number', nullable: true },
            multipliedSubject: { type: 'string', nullable: true, description: 'Môn nhân hệ số 2' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ChanceMajorInput: { // Schema cho việc tạo/cập nhật ChanceMajor
          type: 'object',
          required: ['schoolId', 'sequenceNumber', 'majorCode', 'name'],
          properties: {
            schoolId: { type: 'string' },
            sequenceNumber: { type: 'number' },
            majorCode: { type: 'string' },
            name: { type: 'string' },
            subjectCombinations: { type: 'array', items: { $ref: '#/components/schemas/SubjectCombination' }, nullable: true },
            benchmarkThpt: { type: 'number', nullable: true },
            benchmarkDgnlHn30: { type: 'number', nullable: true },
            benchmarkDgnlHcm30: { type: 'number', nullable: true },
            benchmarkDgnlHn150: { type: 'number', nullable: true },
            benchmarkDgnlHcm150: { type: 'number', nullable: true },
            benchmarkDgtd: { type: 'number', nullable: true },
            multipliedSubject: { type: 'string', nullable: true }
          }
        },
        SubjectBlock: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'MongoDB ObjectID' },
            code: { type: 'string', description: 'Mã khối' },
            name: { type: 'string', description: 'Tên khối (các môn)' },
            subjects: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        SubjectBlockInput: {
          type: 'object',
          required: ['code', 'subjects'],
          properties: {
            code: { type: 'string' },
            name: { type: 'string', nullable: true },
            subjects: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  },
  apis: ['./src/routes/**/*.mjs', './src/auth.mjs'], // Đường dẫn đến các file chứa API routes
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Đăng ký các bộ tuyến đường với tiền tố API tương ứng
app.use('/api/auth', authRouter); // API Xác thực
app.use('/api', mainRouter);      // API cho User (cần xác thực)
app.use('/api', publicRoutes);   // API Công khai (không cần xác thực)
app.use('/api/admin', adminRouter);  // API cho Admin (cần quyền admin)
app.use('/api/chance', chanceRoutes); // API cho Xét Khả năng Trúng Tuyển

// Phục vụ Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware để phục vụ các file tĩnh từ thư mục `uploads` (ví dụ: ảnh đại diện, file hồ sơ)
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000; // Sử dụng cổng từ biến môi trường hoặc mặc định 3000
app.listen(PORT, () => console.log(`Máy chủ đang chạy trên cổng ${PORT}`));

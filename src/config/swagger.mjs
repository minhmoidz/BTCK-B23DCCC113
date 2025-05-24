import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Hệ Thống Xét Tuyển',
      version: '1.0.0',
      description: 'API documentation cho hệ thống xét tuyển',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        UserOutput: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            sdt: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        DonXetTuyen: {
          type: 'object',
          required: ['userId', 'hoTen', 'sdt', 'email', 'ngaySinh', 'truongId', 'nganhId', 'phuongThucXetTuyen', 'toHopXetTuyen', 'doiTuongUuTien'],
          properties: {
            userId: { type: 'string' },
            hoTen: { type: 'string' },
            sdt: { type: 'string' },
            email: { type: 'string' },
            ngaySinh: { type: 'string', format: 'date' },
            truongId: { type: 'string' },
            nganhId: { type: 'string' },
            phuongThucXetTuyen: { type: 'string', enum: ['diem_thi', 'hoc_ba', 'tsa'] },
            toHopXetTuyen: { type: 'string' },
            diemThi: { type: 'number' },
            diemHocBa: { type: 'number' },
            doiTuongUuTien: { type: 'string', enum: ['Khu vực 1', 'Khu vực 2', 'Khu vực 2 nông thôn ', 'Khu vực 3'] },
            minhChung: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  tenFile: { type: 'string' },
                  duongDan: { type: 'string' },
                  loaiFile: { type: 'string' }
                }
              }
            }
          }
        },
        NganhOutput: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            tenNganh: { type: 'string' },
            maNganh: { type: 'string' },
            truongId: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                tenTruong: { type: 'string' },
                maTruong: { type: 'string' }
              },
              description: "Thông tin trường học của ngành (được populate)"
            },
            phuongThucXetTuyen: {
              type: 'array',
              items: { type: 'string', enum: ['diem_thi', 'hoc_ba', 'tsa'] }
            },
            toHopXetTuyen: {
              type: 'array',
              items: { type: 'string' }
            },
            chiTieu: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        NganhInput: {
          type: 'object',
          required: ['tenNganh', 'maNganh', 'truongId', 'chiTieu'],
          properties: {
            tenNganh: { type: 'string', example: 'Công nghệ Thông tin' },
            maNganh: { type: 'string', example: 'IT1' },
            truongId: { type: 'string', description: "ID của trường học mà ngành này thuộc về", example: "60d21b4667d0d8992e610c85" },
            phuongThucXetTuyen: {
              type: 'array',
              items: { type: 'string', enum: ['diem_thi', 'hoc_ba', 'tsa'] },
              example: ['diem_thi', 'tsa']
            },
            toHopXetTuyen: {
              type: 'array',
              items: { type: 'string' },
              example: ['A00', 'A01', 'D07']
            },
            chiTieu: { type: 'number', example: 100 }
          }
        },
        Truong: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            tenTruong: { type: 'string' },
            maTruong: { type: 'string' },
            diaChi: { type: 'string' },
            website: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        TruongInput: {
          type: 'object',
          required: ['tenTruong', 'maTruong', 'diaChi', 'website'],
          properties: {
            tenTruong: { type: 'string', example: 'Đại học Bách Khoa Hà Nội' },
            maTruong: { type: 'string', example: 'BKA' },
            diaChi: { type: 'string', example: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội' },
            website: { type: 'string', example: 'https://hust.edu.vn' }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.mjs', 
    './src/routes/auth.routes.mjs', 
    './src/routes/user.management.routes.mjs',
    './src/routes/truong.routes.mjs',
    './src/routes/nganhRoutes.mjs'
  ],
};

export const specs = swaggerJsdoc(options); 
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
      schemas: {
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
        Nganh: {
          type: 'object',
          required: ['tenNganh', 'maNganh', 'truongId', 'chiTieu'],
          properties: {
            tenNganh: { type: 'string' },
            maNganh: { type: 'string' },
            truongId: { type: 'string' },
            phuongThucXetTuyen: {
              type: 'array',
              items: { type: 'string', enum: ['diem_thi', 'hoc_ba', 'tsa'] }
            },
            toHopXetTuyen: {
              type: 'array',
              items: { type: 'string' }
            },
            chiTieu: { type: 'number' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.mjs'], // đường dẫn đến các file routes
};

export const specs = swaggerJsdoc(options); 
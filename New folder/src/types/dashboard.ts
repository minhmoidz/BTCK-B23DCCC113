export interface TongQuanStats {
  tongSoUser: number;
  userDangKyTuan: number;
  tongSoHoSo: number;
  thongKeTheoTrangThai: Record<string, number>;
}

export interface TruongPhooBien {
  maTruong: string;
  tenTruong: string;
  soLuongDangKy: number;
}

export interface ThongKeTheoThoiGian {
  _id: {
    nam: number;
    thang: number;
    ngay?: number;
    tuan?: number;
  };
  soLuongDangKy?: number;
  soLuongNop?: number;
}

export interface SoSanhData {
  userTheoThang: Array<{
    _id: { nam: number; thang: number };
    soUser: number;
  }>;
  hoSoTheoThang: Array<{
    _id: { nam: number; thang: number };
    soHoSo: number;
  }>;
}

export interface ChartDataPoint {
  time: string;
  users: number;
  hoSo: number;
}

export interface PieDataPoint {
  name: string;
  value: number;
}

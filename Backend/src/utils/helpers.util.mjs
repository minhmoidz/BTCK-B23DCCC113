// utils.mjs
export function safeFolderName(name) {
  return name
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '_')
    .replace(/[^\w-]/g, '')
    .replace(/_+/g, '_');
}

export function generateMaHoSo(phuongThuc) {
  const prefix = phuongThuc.toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

export function getPhuongThucName(code) {
  const phuongThucMap = {
    'tsa': 'Xét tuyển thẳng',
    'hsa': 'Xét tuyển học bạ',
    'thpt': 'Xét tuyển điểm thi THPT',
    'dgnl': 'Đánh giá năng lực',
    'xthb': 'Xét tuyển kết hợp'
  };
  return phuongThucMap[code] || code;
} 
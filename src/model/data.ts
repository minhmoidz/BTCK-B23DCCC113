// src/data.ts
import type { TruongKey, Option } from '../../src/model/types';

export const truongOptions: Option[] = [
  { label: 'Đại học Bách Khoa', value: 'dhbk' },
  { label: 'Đại học Kinh tế', value: 'dhtk' },
  { label: 'Đại học Y Dược', value: 'dhyd' },
];

export const nganhOptions: Record<TruongKey, Option[]> = {
  dhbk: [
    { label: 'Công nghệ thông tin', value: 'cntt' },
    { label: 'Điện tử viễn thông', value: 'dtvt' },
  ],
  dhtk: [
    { label: 'Kinh tế đối ngoại', value: 'ktdn' },
    { label: 'Quản trị kinh doanh', value: 'qtkd' },
  ],
  dhyd: [
    { label: 'Y đa khoa', value: 'ydk' },
    { label: 'Dược học', value: 'dh' },
  ],
};

export const toHopOptions: Option[] = [
  { label: 'A00 (Toán, Lý, Hóa)', value: 'A00' },
  { label: 'B00 (Toán, Hóa, Sinh)', value: 'B00' },
  { label: 'C00 (Văn, Sử, Địa)', value: 'C00' },
  { label: 'D01 (Toán, Văn, Anh)', value: 'D01' },
];

export const doiTuongUuTienOptions: Option[] = [
  { label: 'Không ưu tiên', value: 'none' },
  { label: 'Con thương binh, liệt sĩ', value: 'thuongbinh' },
  { label: 'Hộ nghèo', value: 'hongo' },
  { label: 'Dân tộc thiểu số', value: 'dantoc' },
];

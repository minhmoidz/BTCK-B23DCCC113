// src/pages/Admin/AdmissionManagement/services.ts

import { School, Major, AdmissionQuota } from './types';

export async function fetchSchools(): Promise<School[]> {
  const response = await fetch('https://btck-426k.onrender.com/api/truong');
  if (!response.ok) throw new Error('Không thể tải danh sách trường');
  return response.json();
}

export async function fetchMajors(schoolId: string): Promise<Major[]> {
  const response = await fetch(`https://btck-426k.onrender.com/api/nganh/${schoolId}`);
  if (!response.ok) throw new Error('Không thể tải danh sách ngành');
  return response.json();
}

export async function fetchQuotas(schoolId: string, majorId: string, academicYear: number): Promise<AdmissionQuota> {
  const response = await fetch(
    `https://btck-426k.onrender.com/api/admin/admission-quotas?schoolId=${schoolId}&majorId=${majorId}&academicYear=${academicYear}`
  );
  if (!response.ok) throw new Error('Không thể tải thông tin chỉ tiêu');
  return response.json();
}

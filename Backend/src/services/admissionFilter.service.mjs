import Profile from '../models/Profile.model.mjs';
import AdmissionQuota from '../models/AdmissionQuota.model.mjs';
import AdmissionRule from '../models/AdmissionRule.model.mjs';
import { evaluate } from 'mathjs'; // Thư viện tính toán công thức

// Hàm tính điểm xét tuyển theo công thức
function calculateScore(profile, formula) {
  try {
    // Tạo context với các biến từ profile
    const context = { ...profile._doc };
    
    // Tính toán điểm dựa trên công thức
    return evaluate(formula, context);
  } catch (error) {
    console.error(`Lỗi tính điểm cho hồ sơ ${profile._id}:`, error);
    return 0;
  }
}

// Hàm lọc hồ sơ theo phương thức xét tuyển
async function filterProfilesByMethod(schoolId, majorId, method, academicYear) {
  try {
    // Lấy quy tắc xét tuyển
    const rule = await AdmissionRule.findOne({ schoolId, majorId, academicYear });
    if (!rule || !rule.methods[method]) {
      throw new Error(`Không tìm thấy quy tắc xét tuyển cho phương thức ${method}`);
    }
    
    // Lấy chỉ tiêu
    const quota = await AdmissionQuota.findOne({ schoolId, majorId, academicYear });
    if (!quota || !quota.quotaByMethod[method]) {
      throw new Error(`Không tìm thấy chỉ tiêu cho phương thức ${method}`);
    }
    
    // Lấy tất cả hồ sơ đã duyệt theo phương thức
    const profiles = await Profile.find({
      truong: schoolId,
      maNganh: majorId,
      phuongThuc: method,
      trangThai: 'duyet'
    });
    
    // Tính điểm xét tuyển cho từng hồ sơ
    let scoredProfiles = [];
    
    if (method === 'thpt') {
      // Xét tuyển điểm thi THPT
      const formula = rule.methods.thpt.formula || "diemTongCong + diemUuTien";
      scoredProfiles = profiles.map(profile => ({
        profile,
        score: calculateScore(profile, formula)
      }));
    } 
    else if (method === 'hsa') {
      // Xét tuyển học bạ
      const formula = rule.methods.hsa.formula || "diemTBLop12 * 0.7 + diemTBMonHoc * 0.3";
      scoredProfiles = profiles.map(profile => ({
        profile,
        score: calculateScore(profile, formula)
      }));
    }
    else if (method === 'dgnl') {
      // Đánh giá năng lực
      scoredProfiles = profiles.map(profile => ({
        profile,
        score: profile.diemDanhGiaNangLuc || 0
      }));
    }
    else if (method === 'xthb') {
      // Xét tuyển kết hợp
      const formula = rule.methods.xthb.formula || "diemTBHocTap * 0.6 + diemNangKhieu * 0.4";
      scoredProfiles = profiles.map(profile => ({
        profile,
        score: calculateScore(profile, formula)
      }));
    }
    else if (method === 'tsa') {
      // Xét tuyển thẳng - ưu tiên theo thứ tự loại giải thưởng
      const priorityOrder = rule.methods.tsa.priorityOrder || [];
      
      // Map các loại giải thưởng với điểm ưu tiên
      const priorityMap = {};
      priorityOrder.forEach((priority, index) => {
        priorityMap[priority] = priorityOrder.length - index;
      });
      
      scoredProfiles = profiles.map(profile => ({
        profile,
        score: priorityMap[profile.loaiGiaiThuong] || 0
      }));
    }
    
    // Sắp xếp hồ sơ theo điểm giảm dần
    scoredProfiles.sort((a, b) => b.score - a.score);
    
    // Lấy số lượng hồ sơ theo chỉ tiêu
    const selectedProfiles = scoredProfiles.slice(0, quota.quotaByMethod[method]);
    
    return {
      method,
      quota: quota.quotaByMethod[method],
      totalProfiles: profiles.length,
      selectedProfiles: selectedProfiles.map(item => ({
        profileId: item.profile._id,
        maHoSo: item.profile.maHoSo,
        hoTen: item.profile.hoTen,
        score: item.score
      }))
    };
  } catch (error) {
    console.error(`Lỗi khi lọc hồ sơ phương thức ${method}:`, error);
    return {
      method,
      error: error.message,
      selectedProfiles: []
    };
  }
}

// Hàm lọc tất cả hồ sơ theo tất cả phương thức
export async function filterAllProfiles(schoolId, majorId, academicYear) {
  try {
    const methods = ['thpt', 'hsa', 'tsa', 'dgnl', 'xthb'];
    
    // Lọc hồ sơ theo từng phương thức
    const results = await Promise.all(
      methods.map(method => filterProfilesByMethod(schoolId, majorId, method, academicYear))
    );
    
    // Cập nhật trạng thái trúng tuyển cho các hồ sơ
    for (const result of results) {
      if (result.selectedProfiles && result.selectedProfiles.length > 0) {
        for (const selected of result.selectedProfiles) {
          await Profile.findByIdAndUpdate(selected.profileId, {
            trangThai: 'trung_tuyen',
            $push: {
              lichSuTrangThai: {
                trangThai: 'trung_tuyen',
                thoiGian: new Date(),
                ghiChu: `Trúng tuyển phương thức ${result.method} với điểm ${selected.score}`
              }
            }
          });
        }
      }
    }
    
    return {
      schoolId,
      majorId,
      academicYear,
      results
    };
  } catch (error) {
    console.error('Lỗi khi lọc hồ sơ:', error);
    return { error: error.message };
  }
} 
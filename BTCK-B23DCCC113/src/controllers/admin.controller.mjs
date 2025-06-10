import School from '../models/School.model.mjs';
import Major from '../models/Major.model.mjs';
import SubjectGroup from '../models/SubjectGroup.model.mjs';
import Profile from '../models/Profile.model.mjs';
import AdmissionQuota from '../models/AdmissionQuota.model.mjs';
import AdmissionRule from '../models/AdmissionRule.model.mjs';
import { filterAllProfiles } from '../services/admissionFilter.service.mjs';
import { sendBulkAdmissionNotifications } from '../auth.mjs';
import User from '../models/User.model.mjs'; // Thêm User model

// Hàm helper để chuyển đổi tên phương thức
function getMethodName(method) {
    const methodNames = {
        'thpt': 'Xét điểm thi THPT',
        'hsa': 'Xét học bạ',
        'tsa': 'Xét tài năng/năng khiếu',
        'dgnl': 'Xét đánh giá năng lực',
        'xthb': 'Xét tổng hợp'
    };
    return methodNames[method] || method;
}

// --- QUẢN LÝ TRƯỜNG HỌC ---
export const getSchools = async (req, res) => {
    try {
        const schools = await School.find().sort('name');
        res.json(schools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addSchool = async (req, res) => {
    try {
        const { id, name } = req.body;
        const school = new School({ id, name });
        await school.save();
        res.status(201).json(school);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSchool = async (req, res) => {
    try {
        const { name } = req.body;
        const school = await School.findOneAndUpdate(
            { id: req.params.id },
            { name, updatedAt: Date.now() },
            { new: true }
        );
        if (!school) return res.status(404).json({ message: 'Trường không tồn tại' });
        res.json(school);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSchool = async (req, res) => {
    try {
        const school = await School.findOneAndDelete({ id: req.params.id });
        if (!school) return res.status(404).json({ message: 'Trường không tồn tại' });
        
        await Major.deleteMany({ schoolId: req.params.id });
        await SubjectGroup.deleteMany({ schoolId: req.params.id });
        
        res.json({ message: 'Xóa trường thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- QUẢN LÝ NGÀNH HỌC ---
export const getMajors = async (req, res) => {
    try {
        const { schoolId } = req.query;
        const query = schoolId ? { schoolId } : {};
        const majors = await Major.find(query).sort('name');
        res.json(majors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addMajor = async (req, res) => {
    try {
        const { id, name, schoolId } = req.body;
        const major = new Major({ id, name, schoolId });
        await major.save();
        res.status(201).json(major);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateMajor = async (req, res) => {
    try {
        const { name, schoolId } = req.body;
        const major = await Major.findOneAndUpdate(
            { id: req.params.id, schoolId },
            { name, updatedAt: Date.now() },
            { new: true }
        );
        if (!major) return res.status(404).json({ message: 'Ngành không tồn tại' });
        res.json(major);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteMajor = async (req, res) => {
    try {
        const { schoolId } = req.query;
        const major = await Major.findOneAndDelete({ id: req.params.id, schoolId });
        if (!major) return res.status(404).json({ message: 'Ngành không tồn tại' });
        
        await SubjectGroup.deleteMany({ majorId: req.params.id, schoolId });
        
        res.json({ message: 'Xóa ngành thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- QUẢN LÝ TỔ HỢP MÔN ---
export const getSubjectGroups = async (req, res) => {
    try {
        const { schoolId, majorId } = req.query;
        const query = {};
        if (schoolId) query.schoolId = schoolId;
        if (majorId) query.majorId = majorId;
        
        const subjectGroups = await SubjectGroup.find(query).sort('id');
        res.json(subjectGroups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addSubjectGroup = async (req, res) => {
    try {
        const { id, name, schoolId, majorId } = req.body;
        const subjectGroup = new SubjectGroup({ id, name, schoolId, majorId });
        await subjectGroup.save();
        res.status(201).json(subjectGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSubjectGroup = async (req, res) => {
    try {
        const { name, schoolId, majorId } = req.body;
        const subjectGroup = await SubjectGroup.findOneAndUpdate(
            { id: req.params.id, schoolId, majorId },
            { name, updatedAt: Date.now() },
            { new: true }
        );
        if (!subjectGroup) return res.status(404).json({ message: 'Tổ hợp không tồn tại' });
        res.json(subjectGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSubjectGroup = async (req, res) => {
    try {
        const { schoolId, majorId } = req.query;
        const subjectGroup = await SubjectGroup.findOneAndDelete({ 
            id: req.params.id, 
            schoolId, 
            majorId 
        });
        if (!subjectGroup) return res.status(404).json({ message: 'Tổ hợp không tồn tại' });
        res.json({ message: 'Xóa tổ hợp thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- THỐNG KÊ HỒ SƠ ---
export const getSchoolStatistics = async (req, res) => {
    try {
        const stats = await Profile.aggregate([
            { $group: { 
                _id: "$truong", 
                count: { $sum: 1 },
                daDuyet: { 
                    $sum: { $cond: [{ $eq: ["$trangThai", "da_duyet"] }, 1, 0] }
                },
                dangDuyet: { 
                    $sum: { $cond: [{ $eq: ["$trangThai", "dang_duyet"] }, 1, 0] }
                },
                tuChoi: { 
                    $sum: { $cond: [{ $eq: ["$trangThai", "tu_choi"] }, 1, 0] }
                }
            }},
            { $sort: { count: -1 } }
        ]);
        
        const schools = await School.find();
        const schoolMap = {};
        schools.forEach(school => {
            schoolMap[school.id] = school.name;
        });
        
        const result = stats.map(item => ({
            id: item._id,
            name: schoolMap[item._id] || item._id,
            count: item.count,
            daDuyet: item.daDuyet,
            dangDuyet: item.dangDuyet,
            tuChoi: item.tuChoi
        }));
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMajorStatistics = async (req, res) => {
    try {
        const { schoolId } = req.query;
        
        const matchStage = schoolId ? 
            { $match: { truong: schoolId } } : 
            { $match: {} };
        
        const stats = await Profile.aggregate([
            matchStage,
            { $group: { 
                _id: { truong: "$truong", nganh: "$nganh" }, 
                count: { $sum: 1 },
                daDuyet: { 
                    $sum: { $cond: [{ $eq: ["$trangThai", "da_duyet"] }, 1, 0] }
                },
                dangDuyet: { 
                    $sum: { $cond: [{ $eq: ["$trangThai", "dang_duyet"] }, 1, 0] }
                },
                tuChoi: { 
                    $sum: { $cond: [{ $eq: ["$trangThai", "tu_choi"] }, 1, 0] }
                }
            }},
            { $sort: { "_id.truong": 1, count: -1 } }
        ]);
        
        const schools = await School.find();
        const schoolMap = {};
        schools.forEach(school => {
            schoolMap[school.id] = school.name;
        });
        
        const majors = await Major.find();
        const majorMap = {};
        majors.forEach(major => {
            majorMap[`${major.schoolId}-${major.id}`] = major.name;
        });
        
        const result = stats.map(item => ({
            schoolId: item._id.truong,
            schoolName: schoolMap[item._id.truong] || item._id.truong,
            majorId: item._id.nganh,
            majorName: majorMap[`${item._id.truong}-${item._id.nganh}`] || item._id.nganh,
            count: item.count,
            daDuyet: item.daDuyet,
            dangDuyet: item.dangDuyet,
            tuChoi: item.tuChoi
        }));
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- QUẢN LÝ CHỈ TIÊU XÉT TUYỂN ---
export const getAdmissionQuotas = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear } = req.query;
        
        if (!schoolId || !majorId || !academicYear) {
            return res.status(400).json({ error: 'Thiếu thông tin schoolId, majorId hoặc academicYear' });
        }

        const quota = await AdmissionQuota.findOne({
            schoolId,
            majorId,
            academicYear: parseInt(academicYear)
        });
        
        if (!quota) {
            return res.status(404).json({ message: 'Chưa có chỉ tiêu cho trường/ngành/năm này' });
        }
        
        res.json(quota);
    } catch (error) {
        console.error('Lỗi khi lấy chỉ tiêu:', error);
        res.status(500).json({ error: error.message });
    }
};

export const setAdmissionQuotas = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear, totalQuota, quotaByMethod } = req.body;
        
        if (!schoolId || !majorId || !academicYear || !totalQuota || !quotaByMethod) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
        }
        
        const totalMethodQuota = Object.values(quotaByMethod).reduce((sum, quota) => sum + (quota || 0), 0);
        if (totalMethodQuota !== totalQuota) {
            return res.status(400).json({ 
                error: `Tổng chỉ tiêu các phương thức (${totalMethodQuota}) phải bằng tổng chỉ tiêu (${totalQuota})` 
            });
        }
        
        const quota = await AdmissionQuota.findOneAndUpdate(
            { schoolId, majorId, academicYear },
            { 
                schoolId, 
                majorId, 
                academicYear, 
                totalQuota, 
                quotaByMethod,
                status: 'published',
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );
        
        res.json(quota);
    } catch (error) {
        console.error('Lỗi khi lưu chỉ tiêu:', error);
        res.status(500).json({ error: error.message });
    }
};

// --- QUẢN LÝ QUY TẮC XÉT TUYỂN ---
export const getAdmissionRules = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear } = req.query;
        
        const query = {};
        if (schoolId) query.schoolId = schoolId;
        if (majorId) query.majorId = majorId;
        if (academicYear) query.academicYear = academicYear;
        
        const admissionRules = await AdmissionRule.find(query);
        res.json(admissionRules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const setAdmissionRules = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear, methods } = req.body;
        
        const admissionRule = await AdmissionRule.findOneAndUpdate(
            { schoolId, majorId, academicYear },
            { 
                schoolId, 
                majorId, 
                academicYear, 
                methods,
                updatedAt: Date.now()
            },
            { upsert: true, new: true }
        );
        
        res.json(admissionRule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- XỬ LÝ XÉT TUYỂN ---
export const runAdmissionFilter = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear } = req.body;
        
        if (!schoolId || !majorId || !academicYear) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
        }
        
        const result = await filterAllProfiles(schoolId, majorId, academicYear);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAdmissionResults = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear } = req.query;
        
        const query = { trangThai: 'trung_tuyen' };
        if (schoolId) query.truong = schoolId;
        if (majorId) query.maNganh = majorId;
        
        const profiles = await Profile.find(query).sort('phuongThuc');
        
        const resultsByMethod = {};
        profiles.forEach(profile => {
            if (!resultsByMethod[profile.phuongThuc]) {
                resultsByMethod[profile.phuongThuc] = [];
            }
            resultsByMethod[profile.phuongThuc].push({
                profileId: profile._id,
                maHoSo: profile.maHoSo,
                hoTen: profile.hoTen,
                phuongThuc: profile.phuongThuc,
                tenPhuongThuc: profile.tenPhuongThuc
            });
        });
        
        res.json({
            schoolId,
            majorId,
            academicYear,
            totalAdmitted: profiles.length,
            resultsByMethod
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const completeAdmissionProcess = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear } = req.body;
        
        if (!schoolId || !majorId || !academicYear) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc: schoolId, majorId, academicYear' });
        }
        
        const quota = await AdmissionQuota.findOne({ schoolId, majorId, academicYear });
        if (!quota) {
            return res.status(400).json({ error: 'Chưa có chỉ tiêu cho trường/ngành/năm này. Vui lòng cấu hình chỉ tiêu trước.' });
        }
        
        let rule = await AdmissionRule.findOne({ schoolId, majorId, academicYear });
        if (!rule) {
            console.log('🔧 Tạo quy tắc xét tuyển mặc định...');
            rule = await AdmissionRule.create({
                schoolId,
                majorId,
                academicYear,
                methods: {
                    thpt: {
                        minScore: 15,
                        formula: "diemTongCong + diemUuTien",
                        additionalCriteria: new Map()
                    },
                    hsa: {
                        minScore: 14,
                        formula: "diemTBLop12 * 0.7 + diemTBMonHoc * 0.3",
                        additionalCriteria: new Map()
                    },
                    tsa: {
                        criteria: new Map(),
                        priorityOrder: ["giai_nhat", "giai_nhi", "giai_ba"]
                    },
                    dgnl: {
                        minScore: 12,
                        additionalCriteria: new Map()
                    },
                    xthb: {
                        formula: "diemTBHocTap * 0.6 + diemNangKhieu * 0.4",
                        minScore: 13
                    }
                }
            });
            console.log('✅ Đã tạo quy tắc xét tuyển');
        }
        
        console.log('🚀 Bắt đầu xét tuyển cho:', { schoolId, majorId, academicYear });
        
        const filterResult = await filterAllProfiles(schoolId, majorId, academicYear);
        
        if (filterResult.error) {
            return res.status(400).json({ error: filterResult.error });
        }
        
        const school = await School.findOne({ id: schoolId });
        const major = await Major.findOne({ id: majorId, schoolId });
        
        const admissionResults = [];
        let emailResults = [];
        
        if (filterResult.results) {
            console.log('📧 Chuẩn bị gửi email thông báo trúng tuyển...');
            
            for (const methodResult of filterResult.results) {
                if (methodResult.selectedProfiles && methodResult.selectedProfiles.length > 0) {
                    for (const profile of methodResult.selectedProfiles) {
                        try {
                            const userProfile = await Profile.findById(profile.profileId);
                            if (userProfile && userProfile.email) {
                                const user = await User.findById(userProfile.userId);
                                const userName = user ? user.ten : userProfile.hoTen;
                                
                                admissionResults.push({
                                    userEmail: userProfile.email,
                                    userName: userName || 'Thí sinh',
                                    schoolName: school?.name || schoolId,
                                    majorName: major?.name || majorId,
                                    method: getMethodName(methodResult.method) || 'Không xác định',
                                    score: profile.finalScore || 0
                                });
                            }
                        } catch (profileError) {
                            console.error('❌ Lỗi khi lấy thông tin profile:', profileError);
                        }
                    }
                }
            }
            
            if (admissionResults.length > 0) {
                console.log(`📤 Gửi ${admissionResults.length} email thông báo trúng tuyển...`);
                emailResults = await sendBulkAdmissionNotifications(admissionResults);
                console.log('✅ Hoàn thành gửi email');
            }
        }
        
        const totalProcessed = filterResult.results?.reduce((sum, r) => sum + (r.totalProfiles || 0), 0) || 0;
        const totalAccepted = filterResult.results?.reduce((sum, r) => sum + (r.selectedProfiles?.length || 0), 0) || 0;
        const emailsSent = emailResults.filter(r => r.success).length;
        const emailsFailed = emailResults.filter(r => !r.success).length;
        
        console.log('📊 Kết quả xét tuyển:', { 
            totalProcessed, 
            totalAccepted, 
            emailsSent, 
            emailsFailed 
        });
        
        res.json({
            success: true,
            message: `Xét tuyển hoàn thành! Đã gửi ${emailsSent} email thông báo trúng tuyển`,
            results: filterResult.results || [],
            emailResults,
            summary: {
                totalProcessed,
                totalAccepted,
                emailsSent,
                emailsFailed,
                emailSuccessRate: totalAccepted > 0 ? Math.round((emailsSent / totalAccepted) * 100) : 0
            }
        });
        
    } catch (error) {
        console.error('❌ Lỗi khi thực hiện xét tuyển:', error);
        res.status(500).json({ error: error.message });
    }
};

// --- QUẢN LÝ HỒ SƠ ---
export const getProfiles = async (req, res) => {
    try {
        const { trangThai, phuongThuc, truong, nganh, page = 1, limit = 20 } = req.query;
        
        let query = {};
        
        if (trangThai) query.trangThai = trangThai;
        if (phuongThuc) query.phuongThuc = phuongThuc;
        if (truong) query.truong = truong;
        if (nganh) query.maNganh = nganh;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [profiles, total] = await Promise.all([
            Profile.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Profile.countDocuments(query)
        ]);
        
        res.json({
            profiles,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfileStatus = async (req, res) => {
    const { id } = req.params;
    const { trangThai, ghiChu } = req.body;

    if (!['duyet', 'tu_choi', 'yeu_cau_bo_sung', 'trung_tuyen'].includes(trangThai)) {
        return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    try {
        const profile = await Profile.findById(id);
        if (!profile) {
            return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
        }

        profile.trangThai = trangThai;
        profile.updatedAt = new Date();
        
        profile.lichSuTrangThai.push({
            trangThai,
            thoiGian: new Date(),
            ghiChu: ghiChu || `Cập nhật trạng thái thành ${trangThai}`
        });
        
        await profile.save();
        res.json({ message: `Đã cập nhật trạng thái thành ${trangThai}`, profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const processAdmissionComplete = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear } = req.body;
        
        if (!schoolId || !majorId || !academicYear) {
            return res.status(400).json({ 
                error: 'Thiếu thông tin bắt buộc: schoolId, majorId, academicYear' 
            });
        }
        
        console.log('🚀 Bắt đầu xử lý xét tuyển hoàn thành cho:', { schoolId, majorId, academicYear });
        
        const quota = await AdmissionQuota.findOne({ schoolId, majorId, academicYear });
        if (!quota) {
            return res.status(400).json({ 
                error: 'Chưa có chỉ tiêu cho trường/ngành/năm này. Vui lòng cấu hình chỉ tiêu trước.' 
            });
        }
        
        const filterResult = await filterAllProfiles(schoolId, majorId, academicYear);
        
        if (filterResult.error) {
            return res.status(400).json({ error: filterResult.error });
        }
        
        const totalProcessed = filterResult.results?.reduce((sum, r) => sum + (r.totalProfiles || 0), 0) || 0;
        const totalAccepted = filterResult.results?.reduce((sum, r) => sum + (r.selectedProfiles?.length || 0), 0) || 0;
        
        console.log('📊 Kết quả xét tuyển:', { totalProcessed, totalAccepted });
        
        res.json({
            success: true,
            message: 'Xét tuyển hoàn thành thành công',
            results: filterResult.results || [],
            summary: {
                totalProcessed,
                totalAccepted,
                notificationsSent: totalAccepted // Giả sử thông báo được gửi cho tất cả hồ sơ trúng tuyển
            }
        });
        
    } catch (error) {
        console.error('❌ Lỗi khi thực hiện xét tuyển:', error);
        res.status(500).json({ 
            error: 'Lỗi server khi xử lý xét tuyển',
            details: error.message 
        });
    }
}; 
// Lấy template quy tắc theo ngành
export const getAdmissionRuleTemplate = async (req, res) => {
    try {
        const { majorId } = req.params;
        
        const templates = {
            'CNTT': {
                thpt: {
                    subjectWeights: { toan: 2, ly: 1.5, anhVan: 1.2 },
                    requiredSubjects: [{ subject: 'toan', minScore: 5 }]
                },
                hsa: {
                    prioritySubjects: [
                        { subject: 'toan', weight: 2, description: 'Môn chính ngành CNTT' },
                        { subject: 'ly', weight: 1.5, description: 'Môn hỗ trợ tư duy logic' }
                    ]
                }
            },
            'Y': {
                thpt: {
                    subjectWeights: { sinh: 2, hoa: 1.8, ly: 1.2 },
                    requiredSubjects: [
                        { subject: 'sinh', minScore: 6 },
                        { subject: 'hoa', minScore: 5.5 }
                    ]
                },
                hsa: {
                    prioritySubjects: [
                        { subject: 'sinh', weight: 2.5, description: 'Môn cốt lõi ngành Y' },
                        { subject: 'hoa', weight: 2, description: 'Môn quan trọng ngành Y' }
                    ]
                }
            }
        };
        
        const template = templates[majorId] || {
            thpt: { subjectWeights: {}, requiredSubjects: [] },
            hsa: { prioritySubjects: [], gradeWeights: {} }
        };
        
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật quy tắc chi tiết
export const updateDetailedAdmissionRules = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear, method, rules } = req.body;
        
        if (!schoolId || !majorId || !academicYear || !method || !rules) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
        }
        
        let admissionRule = await AdmissionRule.findOne({ schoolId, majorId, academicYear });
        
        if (!admissionRule) {
            admissionRule = new AdmissionRule({ 
                schoolId, 
                majorId, 
                academicYear, 
                methods: {} 
            });
        }
        
        // Cập nhật quy tắc cho phương thức cụ thể
        if (!admissionRule.methods) {
            admissionRule.methods = {};
        }
        
        admissionRule.methods[method] = {
            ...admissionRule.methods[method],
            ...rules
        };
        
        admissionRule.updatedAt = Date.now();
        await admissionRule.save();
        
        res.json({
            message: `Đã cập nhật quy tắc xét tuyển ${method} thành công`,
            rule: admissionRule.methods[method]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xem trước kết quả áp dụng quy tắc
export const previewAdmissionRules = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear, sampleData } = req.body;
        
        const rule = await AdmissionRule.findOne({ schoolId, majorId, academicYear });
        if (!rule) {
            return res.status(404).json({ error: 'Không tìm thấy quy tắc xét tuyển' });
        }
        
        const previewResults = {};
        
        for (const [method, methodRule] of Object.entries(rule.methods)) {
            if (sampleData[method]) {
                previewResults[method] = calculateScorePreview(sampleData[method], methodRule);
            }
        }
        
        res.json({
            rules: rule.methods,
            previewResults,
            sampleData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hàm helper tính điểm preview
function calculateScorePreview(data, rule) {
    let totalScore = 0;
    let details = {};
    
    // Tính điểm THPT với hệ số
    if (rule.subjectWeights) {
        for (const [subject, weight] of Object.entries(rule.subjectWeights)) {
            if (data[subject] && weight > 0) {
                const weightedScore = data[subject] * weight;
                totalScore += weightedScore;
                details[subject] = {
                    originalScore: data[subject],
                    weight: weight,
                    weightedScore: weightedScore
                };
            }
        }
    }
    
    // Tính điểm học bạ với ưu tiên môn
    if (rule.prioritySubjects) {
        rule.prioritySubjects.forEach(priority => {
            if (data[priority.subject]) {
                const weightedScore = data[priority.subject] * priority.weight;
                totalScore += weightedScore;
                details[priority.subject] = {
                    originalScore: data[priority.subject],
                    weight: priority.weight,
                    weightedScore: weightedScore,
                    description: priority.description
                };
            }
        });
    }
    
    return {
        totalScore: Math.round(totalScore * 100) / 100,
        details,
        passedMinScore: totalScore >= (rule.minScore || 0)
    };
}

// Lấy quy tắc theo phương thức cụ thể
export const getAdmissionRuleByMethod = async (req, res) => {
    try {
        const { schoolId, majorId, academicYear, method } = req.params;
        
        const rule = await AdmissionRule.findOne({ schoolId, majorId, academicYear });
        if (!rule || !rule.methods[method]) {
            return res.status(404).json({ error: 'Không tìm thấy quy tắc cho phương thức này' });
        }
        
        res.json({
            method,
            rules: rule.methods[method],
            schoolId,
            majorId,
            academicYear
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
import Notification from '../models/Notification.mjs';

// Tạo thông báo mới
export const createNotification = async (req, res) => {
  try {
    const { title, content, description } = req.body;
    
    const notification = new Notification({
      title,
      content,
      description
    });

    await notification.save();
    
    res.status(201).json({
      success: true,
      message: 'Thông báo đã được tạo thành công',
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể tạo thông báo',
      error: error.message
    });
  }
};

// Lấy danh sách tất cả thông báo
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể lấy danh sách thông báo',
      error: error.message
    });
  }
};

// Cập nhật thông báo
export const updateNotification = async (req, res) => {
  try {
    const { title, content, description } = req.body;
    
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        description
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Thông báo đã được cập nhật thành công',
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể cập nhật thông báo',
      error: error.message
    });
  }
};

// Xóa thông báo
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Thông báo đã được xóa thành công'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể xóa thông báo',
      error: error.message
    });
  }
}; 

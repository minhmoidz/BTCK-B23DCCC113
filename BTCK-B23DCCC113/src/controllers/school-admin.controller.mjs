import Profile from '../models/Profile.model.mjs';
import School from '../models/School.model.mjs';
import Major from '../models/Major.model.mjs';
import AdmissionQuota from '../models/AdmissionQuota.model.mjs';
import { filterAllProfiles } from '../services/admissionFilter.service.mjs';

// Lấy thông tin tổng quan về hồ sơ của trường
export const getSchoolDashboard = async (req, res) => {
    try {
        const { schoolId } = req.user;
        
        if (!schoolId) {
            return res.status(403).json({ message: 'Admin trường chưa được gán trường cụ thể.' });
        }

        // Lấy thống kê tổng quan
        const stats = await Profile.aggregate([
            { $match: { truong: schoolId } },
            { $group: {
                _id: null,
                total: { $sum: 1 },
                daDuyet: { $sum: { $cond: [{ $eq: ["$trangThai", "da_duyet"] }, 1, 0] } },
                dangDuyet: { $sum: { $cond: [{ $eq: ["$trangThai", "dang_duyet"] }, 1, 0] } },
                tuChoi: { $sum: { $cond: [{ $eq: ["$trangThai", "tu_choi"] }, 1, 0] } },
                trungTuyen: { $sum: { $cond: [{ $eq: ["$trangThai", "trung_tuyen"] }, 1, 0] } }
            }}
        ]);

        // Lấy thống kê theo ngành
        const majorStats = await Profile.aggregate([
            { $match: { truong: schoolId } },
            { $group: {
                _id: "$maNganh",
                total: { $sum: 1 },
                daDuyet: { $sum: { $cond: [{ $eq: ["$trangThai", "da_duyet"] }, 1, 0] } },
                dangDuyet: { $sum: { $cond: [{ $eq: ["$trangThai", "dang_duyet"] }, 1, 0] } },
                tuChoi: { $sum: { $cond: [{ $eq: ["$trangThai", "tu_choi"] }, 1, 0] } },
                trungTuyen: { $sum: { $cond: [{ $eq: ["$trangThai", "trung_tuyen"] }, 1, 0] } }
            }}
        ]);

        // Lấy thông tin trường
        const school = await School.findOne({ id: schoolId });
        
        // Lấy danh sách ngành của trường
        const majors = await Major.find({ schoolId });

        res.json({
            school: {
                id: school.id,
                name: school.name
            },
            statistics: stats[0] || {
                total: 0,
                daDuyet: 0,
                dangDuyet: 0,
                tuChoi: 0,
                trungTuyen: 0
            },
            majorStatistics: majorStats,
            majors: majors.map(major => ({
                id: major.id,
                name: major.name
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách hồ sơ của trường với các bộ lọc
export const getSchoolProfiles = async (req, res) => {
    try {
        const { schoolId } = req.user;
        const { 
            search, 
            status, 
            majorId, 
            method, 
            page = 1, 
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        if (!schoolId) {
            return res.status(403).json({ message: 'Admin trường chưa được gán trường cụ thể.' });
        }

        const query = { truong: schoolId };

        // Thêm các điều kiện tìm kiếm
        if (search) {
            query.$or = [
                { maHoSo: { $regex: search, $options: 'i' } },
                { hoTen: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.trangThai = status;
        if (majorId) query.maNganh = majorId;
        if (method) query.phuongThucXT = method;

        // Tính toán phân trang
        const skip = (page - 1) * limit;
        const totalProfiles = await Profile.countDocuments(query);

        // Lấy danh sách hồ sơ
        const profiles = await Profile.find(query)
            .populate('truong', 'name')
            .populate('nganh', 'name')
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            profiles,
            pagination: {
                totalItems: totalProfiles,
                totalPages: Math.ceil(totalProfiles / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật trạng thái hồ sơ với ghi chú
export const updateProfileStatusWithNote = async (req, res) => {
    try {
        const { schoolId } = req.user;
        const { id } = req.params;
        const { trangThai, ghiChu } = req.body;

        if (!schoolId) {
            return res.status(403).json({ message: 'Admin trường chưa được gán trường cụ thể.' });
        }

        const profile = await Profile.findById(id);
        if (!profile) {
            return res.status(404).json({ message: 'Hồ sơ không tồn tại' });
        }

        if (profile.truong.toString() !== schoolId.toString()) {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật hồ sơ của trường khác.' });
        }

        // Cập nhật trạng thái và thêm vào lịch sử
        profile.trangThai = trangThai;
        profile.lichSuTrangThai.push({
            trangThai,
            thoiGian: new Date(),
            ghiChu: ghiChu || `Cập nhật trạng thái thành ${trangThai}`
        });

        await profile.save();

        res.json({
            message: 'Cập nhật trạng thái hồ sơ thành công',
            profile
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin chi tiết của một hồ sơ
export const getProfileDetail = async (req, res) => {
    try {
        const { schoolId } = req.user;
        const { id } = req.params;

        if (!schoolId) {
            return res.status(403).json({ message: 'Admin trường chưa được gán trường cụ thể.' });
        }

        const profile = await Profile.findById(id)
            .populate('truong', 'name')
            .populate('nganh', 'name');

        if (!profile) {
            return res.status(404).json({ message: 'Hồ sơ không tồn tại' });
        }

        if (profile.truong.toString() !== schoolId.toString()) {
            return res.status(403).json({ message: 'Bạn không có quyền xem hồ sơ của trường khác.' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thống kê theo phương thức xét tuyển
export const getMethodStatistics = async (req, res) => {
    try {
        const { schoolId } = req.user;
        
        if (!schoolId) {
            return res.status(403).json({ message: 'Admin trường chưa được gán trường cụ thể.' });
        }

        const stats = await Profile.aggregate([
            { $match: { truong: schoolId } },
            { $group: {
                _id: "$phuongThucXT",
                total: { $sum: 1 },
                daDuyet: { $sum: { $cond: [{ $eq: ["$trangThai", "da_duyet"] }, 1, 0] } },
                dangDuyet: { $sum: { $cond: [{ $eq: ["$trangThai", "dang_duyet"] }, 1, 0] } },
                tuChoi: { $sum: { $cond: [{ $eq: ["$trangThai", "tu_choi"] }, 1, 0] } },
                trungTuyen: { $sum: { $cond: [{ $eq: ["$trangThai", "trung_tuyen"] }, 1, 0] } }
            }}
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin chỉ tiêu và kết quả xét tuyển
export const getAdmissionQuotaAndResults = async (req, res) => {
    try {
        const { schoolId } = req.user;
        const { majorId, academicYear } = req.query;

        if (!schoolId) {
            return res.status(403).json({ message: 'Admin trường chưa được gán trường cụ thể.' });
        }

        if (!majorId || !academicYear) {
            return res.status(400).json({ message: 'Thiếu thông tin majorId hoặc academicYear' });
        }

        // Lấy thông tin chỉ tiêu
        const quota = await AdmissionQuota.findOne({
            schoolId,
            majorId,
            academicYear: parseInt(academicYear)
        });

        if (!quota) {
            return res.status(404).json({ message: 'Chưa có chỉ tiêu cho ngành/năm này' });
        }

        // Lấy kết quả xét tuyển
        const results = await Profile.aggregate([
            {
                $match: {
                    truong: schoolId,
                    maNganh: majorId,
                    trangThai: 'trung_tuyen'
                }
            },
            {
                $group: {
                    _id: "$phuongThucXT",
                    count: { $sum: 1 },
                    profiles: {
                        $push: {
                            profileId: "$_id",
                            maHoSo: "$maHoSo",
                            hoTen: "$hoTen",
                            diemXetTuyen: "$diemXetTuyen"
                        }
                    }
                }
            }
        ]);

        res.json({
            quota,
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 
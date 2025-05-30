import School from '../models/School.model.mjs';
import Major from '../models/Major.model.mjs';
import SubjectGroup from '../models/SubjectGroup.model.mjs';
import Profile from '../models/Profile.model.mjs';
import User from '../models/User.model.mjs';

// --- APPLICATIONS --- 
export const submitApplication = async (req, res) => {
    try {
        console.log('=== BẮT ĐẦU NỘP HỒ SƠ ===');
        console.log('Dữ liệu nhận được:', req.body);
        
        const profileData = req.body;
        
        if (!profileData.truong || !profileData.nganh || !profileData.toHop) {
            console.log('Thiếu thông tin bắt buộc');
            return res.status(400).json({ error: 'Thiếu thông tin trường, ngành hoặc tổ hợp' });
        }
        
        console.log(`Kiểm tra trường: ${profileData.truong}`);
        const school = await School.findOne({ id: profileData.truong });
        if (!school) {
            console.log('Trường không tồn tại');
            return res.status(400).json({ error: 'Trường không tồn tại' });
        }
        console.log('Trường hợp lệ:', school.name);
        
        console.log(`Kiểm tra ngành: ${profileData.nganh} trong trường ${profileData.truong}`);
        const major = await Major.findOne({ 
            id: profileData.nganh, 
            schoolId: profileData.truong 
        });
        if (!major) {
            console.log('Ngành không tồn tại');
            const allMajors = await Major.find({ schoolId: profileData.truong });
            console.log('Các ngành có sẵn:', allMajors.map(m => ({ id: m.id, name: m.name })));
            return res.status(400).json({ error: 'Ngành không tồn tại' });
        }
        console.log('Ngành hợp lệ:', major.name);
        
        console.log(`Kiểm tra tổ hợp: ${profileData.toHop}`);
        const subjectGroup = await SubjectGroup.findOne({
            id: profileData.toHop,
            schoolId: profileData.truong,
            majorId: profileData.nganh
        });
        if (!subjectGroup) {
            console.log('Tổ hợp môn không tồn tại');
            const allSubjectGroups = await SubjectGroup.find({ 
                schoolId: profileData.truong, 
                majorId: profileData.nganh 
            });
            console.log('Các tổ hợp có sẵn:', allSubjectGroups.map(sg => ({ id: sg.id, name: sg.name })));
            return res.status(400).json({ error: 'Tổ hợp môn không tồn tại' });
        }
        console.log('Tổ hợp hợp lệ:', subjectGroup.name);
        
        const profileCount = await Profile.countDocuments();
        const maHoSo = `HS${(profileCount + 1).toString().padStart(6, '0')}`;
        console.log('Mã hồ sơ được tạo:', maHoSo);
        
        const profile = new Profile({
            ...profileData,
            maHoSo,
            trangThai: 'dang_duyet',
            ngayNop: new Date()
        });
        
        console.log('Chuẩn bị lưu hồ sơ...');
        await profile.save();
        console.log('Lưu hồ sơ thành công!');
        
        res.status(201).json({
            message: 'Nộp hồ sơ thành công',
            maHoSo: profile.maHoSo,
            profileId: profile._id
        });
        
    } catch (error) {
        console.error('=== LỖI NỘP HỒ SƠ ===');
        console.error('Lỗi chi tiết:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: error.message });
    }
};

export const lookupApplication = async (req, res) => {
    try {
        const { maHoSo } = req.params;
        
        const profile = await Profile.findOne({ maHoSo });
        if (!profile) {
            return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
        }
        
        const school = await School.findOne({ id: profile.truong });
        const major = await Major.findOne({ id: profile.nganh, schoolId: profile.truong });
        const subjectGroup = await SubjectGroup.findOne({ 
            id: profile.toHop, 
            schoolId: profile.truong,
            majorId: profile.nganh 
        });
        
        res.json({
            maHoSo: profile.maHoSo,
            hoTen: profile.hoTen,
            truong: school?.name || profile.truong,
            nganh: major?.name || profile.nganh,
            toHop: subjectGroup?.name || profile.toHop,
            trangThai: profile.trangThai,
            ngayNop: profile.ngayNop,
            ghiChu: profile.ghiChu
        });
        
    } catch (error) {
        console.error('Lỗi tra cứu hồ sơ:', error);
        res.status(500).json({ error: error.message });
    }
};

// --- SCHOOLS ---
export const getSchoolsPublic = async (req, res) => {
    try {
        const schools = await School.find().sort('name');
        res.json(schools.map(school => ({
            id: school.id,
            name: school.name
        })));
    } catch (error) {
        console.error('Lỗi lấy danh sách trường:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getMajorsBySchoolPublic = async (req, res) => {
    try {
        const { truongKey } = req.params;
        if (!truongKey) {
            return res.status(400).json({ error: 'Thiếu mã trường' });
        }
        
        console.log(`Tìm ngành cho trường: ${truongKey}`);
        const majors = await Major.find({ schoolId: truongKey }).sort('name');
        console.log(`Tìm thấy ${majors.length} ngành`);
        
        res.json(majors.map(major => ({
            id: major.id,
            name: major.name
        })));
    } catch (error) {
        console.error('Lỗi lấy danh sách ngành:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getSubjectGroupsBySchoolAndMajorPublic = async (req, res) => {
    try {
        const { truongKey, nganhKey } = req.params;
        if (!truongKey || !nganhKey) {
            return res.status(400).json({ error: 'Thiếu mã trường hoặc mã ngành' });
        }
        
        console.log(`Tìm tổ hợp cho trường: ${truongKey}, ngành: ${nganhKey}`);
        const subjectGroups = await SubjectGroup.find({
            schoolId: truongKey,
            majorId: nganhKey
        }).sort('id');
        console.log(`Tìm thấy ${subjectGroups.length} tổ hợp`);
        
        res.json(subjectGroups.map(group => ({
            id: group.id,
            name: group.name
        })));
    } catch (error) {
        console.error('Lỗi lấy danh sách tổ hợp:', error);
        res.status(500).json({ error: error.message });
    }
};

export const debugCheckData = async (req, res) => {
    try {
        const { schoolId, majorId } = req.params;
        
        const school = await School.findOne({ id: schoolId });
        const major = await Major.findOne({ id: majorId, schoolId });
        const subjectGroups = await SubjectGroup.find({ schoolId, majorId });
        
        res.json({
            school: school,
            major: major,
            subjectGroups: subjectGroups,
            counts: {
                schools: await School.countDocuments(),
                majors: await Major.countDocuments({ schoolId }),
                subjectGroups: await SubjectGroup.countDocuments({ schoolId, majorId })
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- STATISTICS ---
export const getGeneralStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProfiles = await Profile.countDocuments();
        
        const profilesByStatus = await Profile.aggregate([
            {
                $group: {
                    _id: '$trangThai',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });
        
        res.json({
            tongSoUser: totalUsers,
            userDangKyTuan: recentUsers,
            tongSoHoSo: totalProfiles,
            thongKeTheoTrangThai: profilesByStatus.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        });
        
    } catch (error) {
        console.error('Lỗi thống kê tổng quan:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getPopularSchoolsStatistics = async (req, res) => {
    try {
        const schoolStats = await Profile.aggregate([
            {
                $group: {
                    _id: '$truong',
                    soLuongDangKy: { $sum: 1 }
                }
            },
            {
                $sort: { soLuongDangKy: -1 }
            },
            {
                $limit: 10
            }
        ]);
        
        const enrichedStats = await Promise.all(
            schoolStats.map(async (stat) => {
                const school = await School.findOne({ id: stat._id });
                return {
                    maTruong: stat._id,
                    tenTruong: school?.name || 'Không xác định',
                    soLuongDangKy: stat.soLuongDangKy
                };
            })
        );
        
        res.json(enrichedStats);
        
    } catch (error) {
        console.error('Lỗi thống kê trường phổ biến:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserRegistrationStatisticsByTime = async (req, res) => {
    try {
        const { loai = 'ngay' } = req.query;
        
        let groupBy;
        switch (loai) {
            case 'tuan':
                groupBy = {
                    nam: { $year: '$createdAt' },
                    tuan: { $week: '$createdAt' }
                };
                break;
            case 'thang':
                groupBy = {
                    nam: { $year: '$createdAt' },
                    thang: { $month: '$createdAt' }
                };
                break;
            default:
                groupBy = {
                    nam: { $year: '$createdAt' },
                    thang: { $month: '$createdAt' },
                    ngay: { $dayOfMonth: '$createdAt' }
                };
        }
        
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: groupBy,
                    soLuongDangKy: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.nam': -1, '_id.thang': -1, '_id.ngay': -1 }
            },
            {
                $limit: 30
            }
        ]);
        
        res.json(userStats);
        
    } catch (error) {
        console.error('Lỗi thống kê user theo thời gian:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getProfileSubmissionStatisticsByTime = async (req, res) => {
    try {
        const { loai = 'ngay' } = req.query;
        
        let groupBy;
        switch (loai) {
            case 'tuan':
                groupBy = {
                    nam: { $year: '$ngayNop' },
                    tuan: { $week: '$ngayNop' }
                };
                break;
            case 'thang':
                groupBy = {
                    nam: { $year: '$ngayNop' },
                    thang: { $month: '$ngayNop' }
                };
                break;
            default:
                groupBy = {
                    nam: { $year: '$ngayNop' },
                    thang: { $month: '$ngayNop' },
                    ngay: { $dayOfMonth: '$ngayNop' }
                };
        }
        
        const profileStats = await Profile.aggregate([
            {
                $group: {
                    _id: groupBy,
                    soLuongNop: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.nam': -1, '_id.thang': -1, '_id.ngay': -1 }
            },
            {
                $limit: 30
            }
        ]);
        
        res.json(profileStats);
        
    } catch (error) {
        console.error('Lỗi thống kê hồ sơ theo thời gian:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getComparisonStatistics = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const userByMonth = await User.aggregate([
            {
                $match: { createdAt: { $gte: sixMonthsAgo } }
            },
            {
                $group: {
                    _id: {
                        nam: { $year: '$createdAt' },
                        thang: { $month: '$createdAt' }
                    },
                    soUser: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.nam': 1, '_id.thang': 1 }
            }
        ]);
        
        const profileByMonth = await Profile.aggregate([
            {
                $match: { ngayNop: { $gte: sixMonthsAgo } }
            },
            {
                $group: {
                    _id: {
                        nam: { $year: '$ngayNop' },
                        thang: { $month: '$ngayNop' }
                    },
                    soHoSo: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.nam': 1, '_id.thang': 1 }
            }
        ]);
        
        res.json({
            userTheoThang: userByMonth,
            hoSoTheoThang: profileByMonth
        });
        
    } catch (error) {
        console.error('Lỗi thống kê so sánh:', error);
        res.status(500).json({ error: error.message });
    }
}; 
import ChanceSchool from '../models/chance/ChanceSchool.model.mjs';
import ChanceMajor from '../models/chance/ChanceMajor.model.mjs';
import SubjectBlock from '../models/chance/SubjectBlock.model.mjs';
import { calculateThptScoreWithPriority, convertDgnl150to30 } from '../services/chance.service.mjs'; // Import hàm từ service

// --- Quản lý Trường (cho tính năng xét khả năng) ---
// Thêm trường mới
export const addChanceSchool = async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id || !name) {
            return res.status(400).json({ message: 'Vui lòng cung cấp ID và Tên trường.' });
        }
        const newSchool = new ChanceSchool({ id, name });
        await newSchool.save();
        res.status(201).json(newSchool);
    } catch (error) {
        if (error.code === 11000) { // Lỗi trùng lặp ID trường
            return res.status(409).json({ message: 'Trường với ID này đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi khi thêm trường.', error: error.message });
    }
};

// Lấy danh sách tất cả các trường
export const getChanceSchools = async (req, res) => {
    try {
        const schools = await ChanceSchool.find().sort('name');
        res.json(schools);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách trường.', error: error.message });
    }
};

// Lấy thông tin một trường theo ID
export const getChanceSchoolById = async (req, res) => {
    try {
        const school = await ChanceSchool.findOne({ id: req.params.schoolId });
        if (!school) {
            return res.status(404).json({ message: 'Không tìm thấy trường.' });
        }
        res.json(school);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin trường.', error: error.message });
    }
};

// Cập nhật thông tin trường
export const updateChanceSchool = async (req, res) => {
    try {
        const { name } = req.body;
        const updatedSchool = await ChanceSchool.findOneAndUpdate(
            { id: req.params.schoolId },
            { name, updatedAt: Date.now() },
            { new: true } // Trả về bản ghi đã được cập nhật
        );
        if (!updatedSchool) {
            return res.status(404).json({ message: 'Không tìm thấy trường để cập nhật.' });
        }
        res.json(updatedSchool);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật trường.', error: error.message });
    }
};

// Xóa trường
export const deleteChanceSchool = async (req, res) => {
    try {
        const deletedSchool = await ChanceSchool.findOneAndDelete({ id: req.params.schoolId });
        if (!deletedSchool) {
            return res.status(404).json({ message: 'Không tìm thấy trường để xóa.' });
        }
        // Xóa tất cả các ngành liên quan đến trường này
        await ChanceMajor.deleteMany({ schoolId: req.params.schoolId });
        res.json({ message: 'Đã xóa trường và các ngành liên quan thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa trường.', error: error.message });
    }
};


// --- Quản lý Ngành học (cho tính năng xét khả năng) ---
// Thêm ngành học mới
export const addChanceMajor = async (req, res) => {
    try {
        const { schoolId, sequenceNumber, majorCode, name, subjectCombinations, benchmarkThpt, benchmarkDgnlHn30, benchmarkDgnlHcm30, benchmarkDgnlHn150, benchmarkDgnlHcm150, benchmarkDgtd, multipliedSubject } = req.body;

        if (!schoolId || !sequenceNumber || !majorCode || !name) {
            return res.status(400).json({ message: 'Vui lòng cung cấp ID Trường, Số thứ tự, Mã ngành và Tên ngành.' });
        }

        const schoolExists = await ChanceSchool.findOne({ id: schoolId });
        if (!schoolExists) {
            return res.status(404).json({ message: `Không tìm thấy trường với ID ${schoolId}.` });
        }

        const newMajor = new ChanceMajor({
            schoolId,
            sequenceNumber,
            majorCode,
            name,
            subjectCombinations,
            benchmarkThpt,
            benchmarkDgnlHn30,
            benchmarkDgnlHcm30,
            benchmarkDgnlHn150,
            benchmarkDgnlHcm150,
            benchmarkDgtd,
            multipliedSubject
        });
        await newMajor.save();
        res.status(201).json(newMajor);
    } catch (error) {
        if (error.code === 11000) { // Lỗi trùng lặp (ID trường + Mã ngành)
            return res.status(409).json({ message: 'Ngành với ID Trường và Mã ngành này đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi khi thêm ngành.', error: error.message });
    }
};

// Lấy danh sách ngành theo trường
export const getChanceMajorsBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const majors = await ChanceMajor.find({ schoolId }).sort('sequenceNumber');
        res.json(majors);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ngành.', error: error.message });
    }
};

// Lấy thông tin một ngành theo ID của ngành (ObjectID của MongoDB)
export const getChanceMajorById = async (req, res) => {
    try {
        const major = await ChanceMajor.findById(req.params.majorId);
        if (!major) {
            return res.status(404).json({ message: 'Không tìm thấy ngành.' });
        }
        res.json(major);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin ngành.', error: error.message });
    }
};

// Cập nhật thông tin ngành
export const updateChanceMajor = async (req, res) => {
    try {
        const { majorId } = req.params; // Đây là ObjectID của ngành
        const updateData = { ...req.body, updatedAt: Date.now() };

        // Kiểm tra nếu schoolId được cung cấp trong body (ví dụ: muốn chuyển ngành sang trường khác)
        // Cần đảm bảo schoolId mới tồn tại
        if (updateData.schoolId) {
            const schoolExists = await ChanceSchool.findOne({ id: updateData.schoolId });
            if (!schoolExists) {
                return res.status(404).json({ message: `Không tìm thấy trường với ID ${updateData.schoolId} nếu bạn đang cố gắng thay đổi trường cho ngành.` });
            }
        }

        const updatedMajor = await ChanceMajor.findByIdAndUpdate(
            majorId,
            updateData,
            { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!updatedMajor) {
            return res.status(404).json({ message: 'Không tìm thấy ngành để cập nhật.' });
        }
        res.json(updatedMajor);
    } catch (error) {
         if (error.code === 11000) { // Lỗi trùng lặp nếu có index unique bị vi phạm
            return res.status(409).json({ message: 'Cập nhật thất bại do vi phạm ràng buộc duy nhất (ví dụ: mã ngành đã tồn tại cho trường đó).' });
        }
        res.status(500).json({ message: 'Lỗi khi cập nhật ngành.', error: error.message });
    }
};

// Xóa ngành theo ID của ngành (ObjectID của MongoDB)
export const deleteChanceMajor = async (req, res) => {
    try {
        const deletedMajor = await ChanceMajor.findByIdAndDelete(req.params.majorId);
        if (!deletedMajor) {
            return res.status(404).json({ message: 'Không tìm thấy ngành để xóa.' });
        }
        res.json({ message: 'Đã xóa ngành thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa ngành.', error: error.message });
    }
};

// --- Quản lý Khối thi (Subject Blocks) ---

// Thêm khối thi mới
export const addSubjectBlock = async (req, res) => {
    try {
        const { code, name, subjects } = req.body;
        if (!code || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ message: 'Mã khối và danh sách môn học là bắt buộc.' });
        }
        const newBlock = new SubjectBlock({ code, name, subjects });
        await newBlock.save();
        res.status(201).json(newBlock);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Khối thi với mã này đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi khi thêm khối thi.', error: error.message });
    }
};

// Lấy danh sách tất cả các khối thi
export const getSubjectBlocks = async (req, res) => {
    try {
        const blocks = await SubjectBlock.find().sort('code');
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách khối thi.', error: error.message });
    }
};

// Lấy thông tin một khối thi theo mã khối
export const getSubjectBlockByCode = async (req, res) => {
    try {
        const block = await SubjectBlock.findOne({ code: req.params.code });
        if (!block) {
            return res.status(404).json({ message: 'Không tìm thấy khối thi.' });
        }
        res.json(block);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin khối thi.', error: error.message });
    }
};

// Cập nhật thông tin khối thi
export const updateSubjectBlock = async (req, res) => {
    try {
        const { name, subjects } = req.body;
        const updatedBlock = await SubjectBlock.findOneAndUpdate(
            { code: req.params.code },
            { name, subjects, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updatedBlock) {
            return res.status(404).json({ message: 'Không tìm thấy khối thi để cập nhật.' });
        }
        res.json(updatedBlock);
    } catch (error) {
        if (error.code === 11000) { // Nên kiểm tra cụ thể hơn nếu có các field unique khác
            return res.status(409).json({ message: 'Cập nhật thất bại, có thể do trùng lặp dữ liệu.' });
        }
        res.status(500).json({ message: 'Lỗi khi cập nhật khối thi.', error: error.message });
    }
};

// Xóa khối thi
export const deleteSubjectBlock = async (req, res) => {
    try {
        const deletedBlock = await SubjectBlock.findOneAndDelete({ code: req.params.code });
        if (!deletedBlock) {
            return res.status(404).json({ message: 'Không tìm thấy khối thi để xóa.' });
        }
        res.json({ message: 'Đã xóa khối thi thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa khối thi.', error: error.message });
    }
};

// Thêm API để tạo nhanh các khối thi từ danh sách bạn cung cấp
export const bulkAddSubjectBlocks = async (req, res) => {
    try {
        const blocksData = req.body.blocks; // Mong đợi một mảng các đối tượng khối thi
        if (!blocksData || !Array.isArray(blocksData)) {
            return res.status(400).json({ message: 'Dữ liệu đầu vào phải là một mảng các khối thi.' });
        }

        const createdBlocks = [];
        const errors = [];

        for (const blockData of blocksData) {
            try {
                const { code, subjects, name } = blockData;
                 if (!code || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
                    errors.push({ code: code || 'Thiếu mã', error: 'Mã khối và danh sách môn học là bắt buộc.' });
                    continue;
                }
                // Kiểm tra xem khối đã tồn tại chưa để tránh lỗi trùng lặp
                const existingBlock = await SubjectBlock.findOne({ code });
                if (existingBlock) {
                    errors.push({ code, error: 'Khối thi đã tồn tại.' });
                    continue;
                }
                const newBlock = new SubjectBlock({ code, name, subjects });
                await newBlock.save();
                createdBlocks.push(newBlock);
            } catch (e) {
                errors.push({ code: blockData.code, error: e.message });
            }
        }

        if (errors.length > 0) {
            return res.status(207).json({ // Multi-Status
                message: 'Hoàn thành việc thêm hàng loạt với một số lỗi.',
                created: createdBlocks,
                errors: errors
            });
        }

        res.status(201).json({ message: 'Đã thêm hàng loạt các khối thi thành công.', created: createdBlocks });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi nghiêm trọng khi thêm hàng loạt khối thi.', error: error.message });
    }
};

// Lấy danh sách ngành dựa trên khối thi (THPT)
export const getChanceMajorsBySubjectBlock = async (req, res) => {
    try {
        const { subjectBlockCode } = req.query;
        if (!subjectBlockCode) {
            return res.status(400).json({ message: 'Vui lòng cung cấp mã khối thi (subjectBlockCode).' });
        }

        // Tìm các ngành có chứa tổ hợp môn này
        // $elemMatch được sử dụng để tìm các document mà trường mảng chứa ít nhất một phần tử khớp với điều kiện
        const majors = await ChanceMajor.find({
            subjectCombinations: { $elemMatch: { code: subjectBlockCode } }
        }).populate({ path: 'schoolId', select: 'id name', foreignField: 'id' }); // Lấy thêm thông tin trường để hiển thị

        if (!majors || majors.length === 0) {
            return res.status(404).json({ message: `Không tìm thấy ngành nào cho khối ${subjectBlockCode}.` });
        }
        res.json(majors);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ngành theo khối thi.', error: error.message });
    }
};

// Lấy danh sách ngành dựa trên loại ĐGNL
export const getChanceMajorsByDgnlType = async (req, res) => {
    try {
        const { dgnlType } = req.query; // vd: "dgnl_hn", "dgnl_hcm"
        if (!dgnlType) {
            return res.status(400).json({ message: 'Vui lòng cung cấp loại ĐGNL (dgnlType).' });
        }

        let queryConditions = [];
        if (dgnlType === 'dgnl_hn') {
            queryConditions = [
                { benchmarkDgnlHn30: { $exists: true, $ne: null } },
                { benchmarkDgnlHn150: { $exists: true, $ne: null } }
            ];
        } else if (dgnlType === 'dgnl_hcm') {
            queryConditions = [
                { benchmarkDgnlHcm30: { $exists: true, $ne: null } },
                { benchmarkDgnlHcm150: { $exists: true, $ne: null } }
            ];
        } else {
            return res.status(400).json({ message: 'Loại ĐGNL không hợp lệ. Chỉ chấp nhận dgnl_hn hoặc dgnl_hcm.' });
        }

        const majors = await ChanceMajor.find({ $or: queryConditions })
            .populate({ path: 'schoolId', select: 'id name', foreignField: 'id' });

        if (!majors || majors.length === 0) {
            return res.status(404).json({ message: `Không tìm thấy ngành nào cho loại ĐGNL ${dgnlType}.` });
        }
        res.json(majors);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ngành theo loại ĐGNL.', error: error.message });
    }
};

// Lấy danh sách ngành dựa trên ĐGTD
export const getChanceMajorsByDgtd = async (req, res) => {
    try {
        // Tìm các ngành có điểm chuẩn cho ĐGTD (điểm chuẩn tồn tại và không null)
        const majors = await ChanceMajor.find({
            benchmarkDgtd: { $exists: true, $ne: null }
        }).populate({ path: 'schoolId', select: 'id name', foreignField: 'id' });

        if (!majors || majors.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy ngành nào xét tuyển bằng ĐGTD.' });
        }
        res.json(majors);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ngành theo ĐGTD.', error: error.message });
    }
};

// --- Tính toán Khả năng Trúng tuyển ---

// Các hằng số PRIORITY_GROUPS và PRIORITY_AREAS đã được chuyển sang chance.service.mjs
// Hàm calculateThptScore đã được chuyển và đổi tên thành calculateThptScoreWithPriority trong chance.service.mjs

// Hàm xác định trạng thái trúng tuyển
function determineAdmissionStatus(userScore, benchmarkScore) {
    if (benchmarkScore == null || userScore == null || isNaN(userScore) || isNaN(benchmarkScore)) {
        return 'Không đủ dữ liệu để xét';
    }

    const difference = userScore - benchmarkScore;

    if (userScore < benchmarkScore * 0.85) return 'Khả năng rất thấp'; // Thấp hơn đáng kể điểm chuẩn
    if (difference >= 2) return 'Khả năng cao';        // Cao hơn điểm chuẩn từ 2 điểm trở lên
    if (difference >= 0.5) return 'Có khả năng';      // Cao hơn điểm chuẩn từ 0.5 đến dưới 2 điểm
    if (difference > -1.5) return 'Khả năng thấp';   // Thấp hơn điểm chuẩn dưới 1.5 điểm
    return 'Khả năng rất thấp';                       // Các trường hợp còn lại (thấp hơn nhiều)
}

// API chính để tính toán khả năng trúng tuyển
export const calculateAdmissionChance = async (req, res) => {
    try {
        const { majorId, admissionType, scores, priorityGroup, priorityArea } = req.body;
        // Điểm người dùng nhập cho ĐGNL/DGTD luôn là `scores.score` và được coi là thang 150 cho ĐGNL.

        const major = await ChanceMajor.findById(majorId);
        if (!major) {
            return res.status(404).json({ message: 'Ngành không tìm thấy.' });
        }

        let userScore;
        let benchmarkScore;
        let status;
        let rawUserScore = scores && scores.score !== undefined ? parseFloat(scores.score) : null;

        switch (admissionType) {
            case 'thpt':
                if (!Array.isArray(scores) || scores.length === 0) {
                    return res.status(400).json({ message: 'Điểm thi THPT phải là một mảng gồm các môn và điểm số.' });
                }
                userScore = calculateThptScoreWithPriority(scores, major.multipliedSubject, priorityGroup, priorityArea);
                benchmarkScore = major.benchmarkThpt;
                status = determineAdmissionStatus(userScore, benchmarkScore);
                break;
            
            case 'dgnl_hn': // ĐGNL Đại học Quốc Gia Hà Nội
                if (rawUserScore === null) return res.status(400).json({ message: 'Vui lòng cung cấp điểm ĐGNL.'});
                if (major.benchmarkDgnlHn30 != null) { // Ưu tiên thang 30 nếu có
                    userScore = convertDgnl150to30(rawUserScore);
                    benchmarkScore = major.benchmarkDgnlHn30;
                } else if (major.benchmarkDgnlHn150 != null) { // Nếu không có thang 30, dùng thang 150
                    userScore = rawUserScore;
                    benchmarkScore = major.benchmarkDgnlHn150;
                } else { // Ngành không có điểm chuẩn ĐGNL Hà Nội
                    return res.json({
                        majorName: major.name,
                        admissionType,
                        userScore: rawUserScore.toFixed(2),
                        benchmarkScore: 'Chưa có điểm chuẩn ĐGNL Hà Nội cho ngành này',
                        status: 'Không đủ dữ liệu để xét'
                    });
                }
                status = determineAdmissionStatus(userScore, benchmarkScore);
                break;

            case 'dgnl_hcm': // ĐGNL Đại học Quốc Gia TP.HCM
                if (rawUserScore === null) return res.status(400).json({ message: 'Vui lòng cung cấp điểm ĐGNL.'});
                if (major.benchmarkDgnlHcm30 != null) { // Ưu tiên thang 30 nếu có
                    userScore = convertDgnl150to30(rawUserScore);
                    benchmarkScore = major.benchmarkDgnlHcm30;
                } else if (major.benchmarkDgnlHcm150 != null) { // Nếu không có thang 30, dùng thang 150
                    userScore = rawUserScore;
                    benchmarkScore = major.benchmarkDgnlHcm150;
                } else { // Ngành không có điểm chuẩn ĐGNL TP.HCM
                    return res.json({
                        majorName: major.name,
                        admissionType,
                        userScore: rawUserScore.toFixed(2),
                        benchmarkScore: 'Chưa có điểm chuẩn ĐGNL TP.HCM cho ngành này',
                        status: 'Không đủ dữ liệu để xét'
                    });
                }
                status = determineAdmissionStatus(userScore, benchmarkScore);
                break;

            case 'dgtd':
                if (rawUserScore === null) return res.status(400).json({ message: 'Vui lòng cung cấp điểm ĐGTD.'});
                userScore = rawUserScore;
                benchmarkScore = major.benchmarkDgtd;
                status = determineAdmissionStatus(userScore, benchmarkScore);
                break;
            default:
                return res.status(400).json({ message: 'Loại hình xét tuyển không hợp lệ.' });
        }

        res.json({
            majorName: major.name,
            admissionType,
            userScore: userScore != null && !isNaN(userScore) ? userScore.toFixed(2) : 'Không thể tính toán',
            benchmarkScore: benchmarkScore != null ? benchmarkScore : 'Chưa có điểm chuẩn',
            status
        });

    } catch (error) {
        console.error("Lỗi khi tính khả năng trúng tuyển:", error);
        res.status(500).json({ message: 'Lỗi máy chủ khi tính toán khả năng trúng tuyển.', error: error.message });
    }
}; 
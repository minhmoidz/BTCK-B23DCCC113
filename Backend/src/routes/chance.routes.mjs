import express from 'express';
import {
    addChanceSchool,
    getChanceSchools,
    getChanceSchoolById,
    updateChanceSchool,
    deleteChanceSchool,
    addChanceMajor,
    getChanceMajorsBySchool,
    getChanceMajorById,
    updateChanceMajor,
    deleteChanceMajor,
    calculateAdmissionChance,
    addSubjectBlock,
    getSubjectBlocks,
    getSubjectBlockByCode,
    updateSubjectBlock,
    deleteSubjectBlock,
    bulkAddSubjectBlocks,
    getChanceMajorsBySubjectBlock,
    getChanceMajorsByDgnlType,
    getChanceMajorsByDgtd
} from '../controllers/chance.controller.mjs';
// import { isAdmin } from '../auth.mjs'; // Nếu cần bảo vệ các API CRUD, hãy bỏ comment dòng này và thêm middleware `isAdmin`

const router = express.Router();

// --- Tuyến đường cho Quản lý Trường (Xét Khả năng) ---
/**
 * @swagger
 * /api/chance/schools:
 *   post:
 *     summary: Thêm một trường mới vào danh sách xét khả năng
 *     tags: [Chance - Schools]
 *     description: 'Tạo một trường mới để sử dụng trong tính năng tính toán khả năng trúng tuyển. (Yêu cầu quyền Admin nếu có)'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 description: 'Mã trường duy nhất (ví dụ: HUST, VNU).'
 *               name:
 *                 type: string
 *                 description: 'Tên đầy đủ của trường.'
 *     responses:
 *       201:
 *         description: 'Trường đã được tạo thành công.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChanceSchool'
 *       400:
 *         description: 'Dữ liệu không hợp lệ (thiếu ID hoặc tên).'
 *       409:
 *         description: 'Trường với ID này đã tồn tại.'
 *       500:
 *         description: 'Lỗi server.'
 */
router.post('/schools', addChanceSchool); 

/**
 * @swagger
 * /api/chance/schools/{schoolId}:
 *   put:
 *     summary: Cập nhật thông tin một trường xét khả năng
 *     tags: [Chance - Schools]
 *     description: Cập nhật tên của một trường đã có trong danh sách xét khả năng. (Yêu cầu quyền Admin nếu có)
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: ID của trường cần cập nhật.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên mới của trường.
 *     responses:
 *       200:
 *         description: Trường đã được cập nhật thành công.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChanceSchool'
 *       404:
 *         description: Không tìm thấy trường để cập nhật.
 *       500:
 *         description: Lỗi server.
 */
router.put('/schools/:schoolId', updateChanceSchool); 

/**
 * @swagger
 * /api/chance/schools/{schoolId}:
 *   delete:
 *     summary: Xóa một trường xét khả năng
 *     tags: [Chance - Schools]
 *     description: Xóa một trường khỏi danh sách xét khả năng và tất cả các ngành liên quan đến trường đó. (Yêu cầu quyền Admin nếu có)
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: ID của trường cần xóa.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa trường và các ngành liên quan thành công.
 *       404:
 *         description: Không tìm thấy trường để xóa.
 *       500:
 *         description: Lỗi server.
 */
router.delete('/schools/:schoolId', deleteChanceSchool); 

/**
 * @swagger
 * /api/chance/schools:
 *   get:
 *     summary: Lấy danh sách tất cả các trường xét khả năng
 *     tags: [Chance - Schools]
 *     description: Trả về danh sách tất cả các trường đã được thêm cho tính năng tính toán khả năng trúng tuyển.
 *     responses:
 *       200:
 *         description: Danh sách các trường.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChanceSchool' 
 *       500:
 *         description: Lỗi server.
 */
router.get('/schools', getChanceSchools);

/**
 * @swagger
 * /api/chance/schools/{schoolId}:
 *   get:
 *     summary: Lấy thông tin một trường xét khả năng theo ID
 *     tags: [Chance - Schools]
 *     description: Trả về thông tin chi tiết của một trường cụ thể trong danh sách xét khả năng.
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: ID của trường.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của trường.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChanceSchool'
 *       404:
 *         description: Không tìm thấy trường.
 *       500:
 *         description: Lỗi server.
 */
router.get('/schools/:schoolId', getChanceSchoolById);


// --- Tuyến đường cho Quản lý Ngành học (Xét Khả năng) ---
/**
 * @swagger
 * /api/chance/majors:
 *   post:
 *     summary: Thêm một ngành học mới cho một trường trong danh sách xét khả năng
 *     tags: [Chance - Majors]
 *     description: Tạo một ngành học mới liên kết với một trường đã có, dùng cho tính năng tính toán khả năng trúng tuyển. (Yêu cầu quyền Admin nếu có)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChanceMajorInput' 
 *     responses:
 *       201:
 *         description: Ngành đã được tạo thành công.
 *       400:
 *         description: Dữ liệu không hợp lệ.
 *       404:
 *         description: Trường không tồn tại.
 *       409:
 *         description: Ngành với ID Trường và Mã ngành này đã tồn tại.
 *       500:
 *         description: Lỗi server.
 */
router.post('/majors', addChanceMajor); 

/**
 * @swagger
 * /api/chance/majors/{majorId}:
 *   put:
 *     summary: Cập nhật thông tin một ngành học xét khả năng
 *     tags: [Chance - Majors]
 *     description: Cập nhật thông tin của một ngành học đã có. (Yêu cầu quyền Admin nếu có)
 *     parameters:
 *       - in: path
 *         name: majorId
 *         required: true
 *         description: ObjectID của ngành cần cập nhật.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChanceMajorInput' 
 *     responses:
 *       200:
 *         description: Ngành đã được cập nhật thành công.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChanceMajor'
 *       404:
 *         description: Không tìm thấy ngành để cập nhật hoặc trường liên kết không tồn tại.
 *       409:
 *         description: Cập nhật thất bại do vi phạm ràng buộc duy nhất.
 *       500:
 *         description: Lỗi server.
 */
router.put('/majors/:majorId', updateChanceMajor); 

/**
 * @swagger
 * /api/chance/majors/{majorId}:
 *   delete:
 *     summary: Xóa một ngành học xét khả năng
 *     tags: [Chance - Majors]
 *     description: Xóa một ngành học khỏi danh sách xét khả năng. (Yêu cầu quyền Admin nếu có)
 *     parameters:
 *       - in: path
 *         name: majorId
 *         required: true
 *         description: ObjectID của ngành cần xóa.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa ngành thành công.
 *       404:
 *         description: Không tìm thấy ngành để xóa.
 *       500:
 *         description: Lỗi server.
 */
router.delete('/majors/:majorId', deleteChanceMajor); 

/**
 * @swagger
 * /api/chance/schools/{schoolId}/majors:
 *   get:
 *     summary: Lấy danh sách các ngành của một trường (xét khả năng)
 *     tags: [Chance - Majors]
 *     description: Trả về danh sách tất cả các ngành của một trường cụ thể dùng cho tính năng xét khả năng.
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: ID của trường.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách các ngành.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChanceMajor'
 *       500:
 *         description: Lỗi server.
 */
router.get('/schools/:schoolId/majors', getChanceMajorsBySchool);

// --- Tuyến đường mới để tìm kiếm ngành theo tiêu chí ---
/**
 * @swagger
 * /api/chance/majors/by-subject-block:
 *   get:
 *     summary: Lấy danh sách ngành theo khối thi (cho THPT)
 *     tags: [Chance - Majors Search]
 *     description: Tìm kiếm và trả về danh sách các ngành xét tuyển dựa trên một mã khối thi cụ thể.
 *     parameters:
 *       - in: query
 *         name: subjectBlockCode
 *         required: true
 *         description: Mã khối thi (ví dụ A00, D01).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách các ngành phù hợp.
 *       400:
 *         description: Thiếu mã khối thi.
 *       404:
 *         description: Không tìm thấy ngành nào cho khối thi này.
 *       500:
 *         description: Lỗi server.
 */
router.get('/majors/by-subject-block', getChanceMajorsBySubjectBlock);

/**
 * @swagger
 * /api/chance/majors/by-dgnl:
 *   get:
 *     summary: Lấy danh sách ngành theo loại ĐGNL
 *     tags: [Chance - Majors Search]
 *     description: Tìm kiếm và trả về danh sách các ngành xét tuyển dựa trên loại kỳ thi ĐGNL.
 *     parameters:
 *       - in: query
 *         name: dgnlType
 *         required: true
 *         description: Loại ĐGNL (ví dụ dgnl_hn, dgnl_hcm).
 *         schema:
 *           type: string
 *           enum: [dgnl_hn, dgnl_hcm]
 *     responses:
 *       200:
 *         description: Danh sách các ngành phù hợp.
 *       400:
 *         description: Thiếu loại ĐGNL hoặc loại không hợp lệ.
 *       404:
 *         description: Không tìm thấy ngành nào cho loại ĐGNL này.
 *       500:
 *         description: Lỗi server.
 */
router.get('/majors/by-dgnl', getChanceMajorsByDgnlType);

/**
 * @swagger
 * /api/chance/majors/by-dgtd:
 *   get:
 *     summary: Lấy danh sách ngành theo ĐGTD
 *     tags: [Chance - Majors Search]
 *     description: Tìm kiếm và trả về danh sách các ngành xét tuyển bằng phương thức Đánh giá tư duy.
 *     responses:
 *       200:
 *         description: Danh sách các ngành phù hợp.
 *       404:
 *         description: Không tìm thấy ngành nào xét tuyển bằng ĐGTD.
 *       500:
 *         description: Lỗi server.
 */
router.get('/majors/by-dgtd', getChanceMajorsByDgtd);

/**
 * @swagger
 * /api/chance/majors/{majorId}:
 *   get:
 *     summary: Lấy thông tin một ngành xét khả năng theo ObjectID
 *     tags: [Chance - Majors]
 *     description: Trả về thông tin chi tiết của một ngành cụ thể.
 *     parameters:
 *       - in: path
 *         name: majorId
 *         required: true
 *         description: ObjectID của ngành.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của ngành.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChanceMajor'
 *       404:
 *         description: Không tìm thấy ngành.
 *       500:
 *         description: Lỗi server.
 */
router.get('/majors/:majorId', getChanceMajorById);


// --- Tuyến đường cho Quản lý Khối thi (Subject Blocks) ---
/**
 * @swagger
 * /api/chance/subject-blocks:
 *   post:
 *     summary: Thêm một khối thi mới
 *     tags: [Chance - Subject Blocks]
 *     description: Tạo một khối thi mới (ví dụ A00, D01) với danh sách các môn học. (Yêu cầu quyền Admin nếu có)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubjectBlockInput'
 *     responses:
 *       201:
 *         description: Khối thi đã được tạo.
 *       400:
 *         description: Dữ liệu không hợp lệ.
 *       409:
 *         description: Khối thi với mã này đã tồn tại.
 *       500:
 *         description: Lỗi server.
 */
router.post('/subject-blocks', addSubjectBlock);
/**
 * @swagger
 * /api/chance/subject-blocks:
 *   get:
 *     summary: Lấy danh sách tất cả các khối thi
 *     tags: [Chance - Subject Blocks]
 *     description: Trả về danh sách tất cả các khối thi đã được định nghĩa.
 *     responses:
 *       200:
 *         description: Danh sách các khối thi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubjectBlock'
 *       500:
 *         description: Lỗi server.
 */
router.get('/subject-blocks', getSubjectBlocks);

/**
 * @swagger
 * /api/chance/subject-blocks/bulk:
 *   post:
 *     summary: Thêm hàng loạt khối thi mới
 *     tags: [Chance - Subject Blocks]
 *     description: Cho phép thêm nhiều khối thi cùng một lúc. (Yêu cầu quyền Admin nếu có)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blocks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/SubjectBlockInput'
 *     responses:
 *       201:
 *         description: Đã thêm hàng loạt các khối thi thành công.
 *       207:
 *         description: Hoàn thành việc thêm hàng loạt với một số lỗi.
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ.
 *       500:
 *         description: Lỗi server.
 */
router.post('/subject-blocks/bulk', bulkAddSubjectBlocks);

/**
 * @swagger
 * /api/chance/subject-blocks/{code}:
 *   get:
 *     summary: Lấy thông tin một khối thi theo mã khối
 *     tags: [Chance - Subject Blocks]
 *     description: Trả về thông tin chi tiết của một khối thi dựa trên mã của nó.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Mã khối thi (ví dụ A00).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết khối thi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectBlock'
 *       404:
 *         description: Không tìm thấy khối thi.
 *       500:
 *         description: Lỗi server.
 */
router.get('/subject-blocks/:code', getSubjectBlockByCode);

/**
 * @swagger
 * /api/chance/subject-blocks/{code}:
 *   put:
 *     summary: Cập nhật thông tin khối thi
 *     tags: [Chance - Subject Blocks]
 *     description: Cập nhật tên hoặc danh sách môn của một khối thi đã có. (Yêu cầu quyền Admin nếu có)
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Mã khối thi cần cập nhật.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 nullable: true
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Khối thi đã được cập nhật.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectBlock'
 *       404:
 *         description: Không tìm thấy khối thi để cập nhật.
 *       409:
 *         description: Cập nhật thất bại, có thể do trùng lặp dữ liệu.
 *       500:
 *         description: Lỗi server.
 */
router.put('/subject-blocks/:code', updateSubjectBlock);

/**
 * @swagger
 * /api/chance/subject-blocks/{code}:
 *   delete:
 *     summary: Xóa khối thi
 *     tags: [Chance - Subject Blocks]
 *     description: Xóa một khối thi khỏi hệ thống. (Yêu cầu quyền Admin nếu có)
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Mã khối thi cần xóa.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa khối thi thành công.
 *       404:
 *         description: Không tìm thấy khối thi để xóa.
 *       500:
 *         description: Lỗi server.
 */
router.delete('/subject-blocks/:code', deleteSubjectBlock);


// --- Tuyến đường cho Tính toán Khả năng Trúng tuyển ---
/**
 * @swagger
 * /api/chance/calculate:
 *   post:
 *     summary: Tính toán khả năng trúng tuyển cho một ngành cụ thể
 *     tags: [Chance - Calculation]
 *     description: Dựa trên thông tin điểm số, ưu tiên và ngành lựa chọn, API sẽ trả về đánh giá khả năng trúng tuyển.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - majorId
 *               - admissionType
 *               - scores
 *             properties:
 *               majorId:
 *                 type: string
 *                 description: ObjectID của ngành (ChanceMajor) cần tính toán.
 *               admissionType:
 *                 type: string
 *                 description: Loại hình xét tuyển.
 *                 enum: [thpt, dgnl_hn, dgnl_hcm, dgtd]
 *               scores:
 *                 type: object
 *                 description: Điểm số của thí sinh. Đối với 'thpt', đây là mảng các đối tượng môn học. Đối với các loại khác, đây là đối tượng có trường 'score'.
 *                 oneOf:
 *                   - type: array # Cho THPT
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Tên môn học (ví dụ Toán, Lý, Hoá).
 *                         score:
 *                           type: number
 *                           description: Điểm môn học.
 *                   - type: object # Cho ĐGNL, ĐGTD
 *                     properties:
 *                       score:
 *                         type: number
 *                         description: Điểm thi ĐGNL hoặc ĐGTD.
 *               priorityGroup:
 *                 type: string
 *                 description: Mã đối tượng ưu tiên (chỉ dùng cho THPT, ví dụ '1', '5', '0').
 *               priorityArea:
 *                 type: string
 *                 description: Mã khu vực ưu tiên (chỉ dùng cho THPT, ví dụ 'KV1', 'KV2-NT', '0').
 *     responses:
 *       200:
 *         description: Kết quả tính toán khả năng trúng tuyển.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 majorName:
 *                   type: string
 *                 admissionType:
 *                   type: string
 *                 userScore:
 *                   type: string # Hoặc number, tùy vào logic làm tròn
 *                 benchmarkScore:
 *                   type: string # Hoặc number
 *                 status:
 *                   type: string
 *                   enum: [Khả năng cao, Có khả năng, Khả năng thấp, Khả năng rất thấp, Không đủ dữ liệu để xét]
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ (thiếu thông tin, loại xét tuyển sai, điểm không hợp lệ).
 *       404:
 *         description: Ngành không tìm thấy.
 *       500:
 *         description: Lỗi server khi tính toán.
 */
router.post('/calculate', calculateAdmissionChance);


export { router as chanceRoutes }; 
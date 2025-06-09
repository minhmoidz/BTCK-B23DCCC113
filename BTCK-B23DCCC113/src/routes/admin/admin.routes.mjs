import express from 'express';
import { isAdmin } from '../../auth.mjs';
import {
    getSchools,
    addSchool,
    updateSchool,
    deleteSchool,
    getMajors,
    addMajor,
    updateMajor,
    deleteMajor,
    getSubjectGroups,
    addSubjectGroup,
    updateSubjectGroup,
    deleteSubjectGroup,
    getSchoolStatistics,
    getMajorStatistics,
    getAdmissionQuotas,
    setAdmissionQuotas,
    getAdmissionRules,
    setAdmissionRules,
    runAdmissionFilter,
    getAdmissionResults,
    completeAdmissionProcess,
    getProfiles,
    updateProfileStatus,
    processAdmissionComplete,
    getAdmissionRuleTemplate,
    updateDetailedAdmissionRules,
    previewAdmissionRules,
    getAdmissionRuleByMethod,
    createSchoolAdmin
} from '../../controllers/admin.controller.mjs';

const router = express.Router();

// Middleware xác thực admin cho tất cả routes
router.use(isAdmin);

// --- API QUẢN LÝ TÀI KHOẢN SCHOOL ADMIN ---
router.post('/school-admin', createSchoolAdmin);

// --- API QUẢN LÝ TRƯỜNG HỌC ---
router.get('/schools', getSchools);
router.post('/schools', addSchool);
router.put('/schools/:id', updateSchool);
router.delete('/schools/:id', deleteSchool);

// --- API QUẢN LÝ NGÀNH HỌC ---
router.get('/majors', getMajors);
router.post('/majors', addMajor);
router.put('/majors/:id', updateMajor);
router.delete('/majors/:id', deleteMajor);

// --- API QUẢN LÝ TỔ HỢP MÔN ---
router.get('/subject-groups', getSubjectGroups);
router.post('/subject-groups', addSubjectGroup);
router.put('/subject-groups/:id', updateSubjectGroup);
router.delete('/subject-groups/:id', deleteSubjectGroup);

// --- API THỐNG KÊ HỒ SƠ ---
router.get('/statistics/schools', getSchoolStatistics);
router.get('/statistics/majors', getMajorStatistics);

// --- API QUẢN LÝ CHỈ TIÊU XÉT TUYỂN ---
router.get('/admission-quotas', getAdmissionQuotas);
router.post('/admission-quotas', setAdmissionQuotas);

// --- API QUẢN LÝ QUY TẮC XÉT TUYỂN ---
router.get('/admission-rules', getAdmissionRules);
router.post('/admission-rules', setAdmissionRules);

// --- API XỬ LÝ XÉT TUYỂN ---
router.post('/admission-process/run-filter', runAdmissionFilter);
router.get('/admission-process/results', getAdmissionResults);
router.post('/admission-process/complete', completeAdmissionProcess);

// --- API QUẢN LÝ HỒ SƠ ---
router.get('/profiles', getProfiles);
router.post('/profiles/:id/status', updateProfileStatus);
// --- API QUẢN LÝ QUY TẮC XÉT TUYỂN CHI TIẾT ---
router.get('/admission-rules/template/:majorId', getAdmissionRuleTemplate);
router.put('/admission-rules/detailed', updateDetailedAdmissionRules);
router.post('/admission-rules/preview', previewAdmissionRules);
router.get('/admission-rules/:schoolId/:majorId/:academicYear/:method', getAdmissionRuleByMethod);

// Thêm route mới đã có trong controller
router.post('/process-admission-complete', processAdmissionComplete);

export { router }; 
// src/services/chance.service.mjs

// Điểm cộng theo đối tượng ưu tiên
const PRIORITY_GROUPS = {
    '1': 2, '2': 2, '3': 2, '4': 2, // Đối tượng 1-4: 2 điểm
    '5': 1, '6': 1,                 // Đối tượng 5-6: 1 điểm
    '0': 0                          // Không có ưu tiên: 0 điểm
};

// Điểm cộng theo khu vực ưu tiên
const PRIORITY_AREAS = {
    'KV1': 0.75,    // Khu vực 1: 0.75 điểm
    'KV2-NT': 0.5,  // Khu vực 2 Nông thôn: 0.5 điểm
    'KV2': 0.25,    // Khu vực 2: 0.25 điểm
    'KV3': 0,       // Khu vực 3: 0 điểm
    '0': 0          // Không có ưu tiên: 0 điểm
};

/**
 * Tính điểm xét tuyển THPT dựa trên điểm các môn, môn nhân hệ số và điểm ưu tiên.
 * @param {Array<{name: String, score: Number}>} subjects - Mảng các đối tượng môn học và điểm số.
 * @param {String} multipliedSubject - Tên môn học được nhân hệ số 2 (nếu có).
 * @param {String} priorityGroupCode - Mã đối tượng ưu tiên ('1'-'6', hoặc '0' nếu không có).
 * @param {String} priorityAreaCode - Mã khu vực ưu tiên ('KV1', 'KV2-NT', 'KV2', 'KV3', hoặc '0' nếu không có).
 * @returns {Number} Điểm xét tuyển cuối cùng.
 */
export function calculateThptScoreWithPriority(subjects, multipliedSubject, priorityGroupCode, priorityAreaCode) {
    let totalSubjectScore = 0; // Tổng điểm các môn (thang 30 hoặc 40 nếu có nhân hệ số)
    let baseScoreForPriorityCalc = 0; // Tổng điểm các môn dùng để quy về thang 30 khi tính điểm ưu tiên

    subjects.forEach(subject => {
        let score = parseFloat(subject.score);
        if (isNaN(score)) { // Bỏ qua nếu điểm không hợp lệ
            console.warn(`Điểm không hợp lệ cho môn ${subject.name}: ${subject.score}`);
            return;
        }
        if (subject.name === multipliedSubject) {
            totalSubjectScore += score * 2;
            baseScoreForPriorityCalc += score * 2;
        } else {
            totalSubjectScore += score;
            baseScoreForPriorityCalc += score;
        }
    });

    // Nếu có môn nhân hệ số 2, tổng điểm thực tế là trên thang 40.
    // Công thức điểm ưu tiên ((30 - Tổng điểm đạt được)/7.5) * Tổng điểm ưu tiên chuẩn) áp dụng cho thang 30.
    // Vì vậy, cần quy đổi baseScoreForPriorityCalc về thang 30 nếu có môn nhân hệ số.

    let normalizedScoreForPriority = baseScoreForPriorityCalc;

    if (multipliedSubject) {
      // Quy đổi điểm về thang 30 để tính điểm ưu tiên
      // Điểm trên thang 40, muốn quy về thang 30
      normalizedScoreForPriority = (baseScoreForPriorityCalc / 40) * 30;
    }

    const priorityPointsGroup = PRIORITY_GROUPS[priorityGroupCode] || 0;
    const priorityPointsArea = PRIORITY_AREAS[priorityAreaCode] || 0;
    const totalStandardPriorityPoints = priorityPointsGroup + priorityPointsArea; // Tổng điểm ưu tiên chuẩn

    let calculatedPriorityBonus = 0; // Điểm ưu tiên thực tế được cộng
    
    // Chỉ tính điểm ưu tiên nếu tổng điểm chuẩn hóa (thang 30) nhỏ hơn 30 và có điểm ưu tiên chuẩn
    if (totalStandardPriorityPoints > 0 && normalizedScoreForPriority < 30) {
         // Áp dụng công thức: Điểm ưu tiên = [(30 - Tổng điểm đạt được)/7.5] x Tổng điểm ưu tiên chuẩn
         calculatedPriorityBonus = ((30 - normalizedScoreForPriority) / 7.5) * totalStandardPriorityPoints;
         calculatedPriorityBonus = Math.max(0, calculatedPriorityBonus); // Đảm bảo điểm cộng không âm
    }
    
    // Điểm xét tuyển cuối cùng = Tổng điểm môn (có thể là thang 40) + Điểm ưu tiên thực tế
    return totalSubjectScore + calculatedPriorityBonus;
}

/**
 * Quy đổi điểm ĐGNL từ thang 150 điểm sang thang 30 điểm.
 * @param {Number} score150 - Điểm trên thang 150.
 * @returns {Number} Điểm tương đương trên thang 30.
 */
export function convertDgnl150to30(score150) {
    if (score150 == null || isNaN(parseFloat(score150))) {
        return null; // Hoặc ném lỗi tùy theo cách xử lý mong muốn
    }
    return (parseFloat(score150) / 150) * 30;
} 
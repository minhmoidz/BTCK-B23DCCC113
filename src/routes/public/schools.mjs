import express from 'express';
import School from '../../models/School.mjs';
import Major from '../../models/Major.mjs';
import SubjectGroup from '../../models/SubjectGroup.mjs';

const router = express.Router();

// API lấy danh sách trường cho form xét tuyển
router.get('/truong', async (req, res) => {
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
});

// API lấy danh sách ngành theo trường
router.get('/nganh/:truongKey', async (req, res) => {
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
});

// API lấy tổ hợp môn theo trường và ngành
router.get('/tohop/:truongKey/:nganhKey', async (req, res) => {
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
});

// API debug để kiểm tra dữ liệu
router.get('/debug/check-data/:schoolId/:majorId', async (req, res) => {
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
});

export { router as schoolRoutes };

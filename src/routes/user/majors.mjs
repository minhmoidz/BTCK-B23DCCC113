import express from 'express';
import Major from '../../models/Major.mjs';

const router = express.Router();

// --- API lấy danh sách ngành theo trường ---
router.get('/nganh/:truongKey', async (req, res) => {
  try {
    const { truongKey } = req.params;
    console.log('Getting majors for school:', truongKey);
    
    const majors = await Major.find({ schoolId: truongKey }).sort('name');
    console.log(`Found ${majors.length} majors for school ${truongKey}`);
    
    if (majors && majors.length > 0) {
      res.json(majors.map(major => ({
        id: major.id,
        name: major.name
      })));
    } else {
      console.log('No majors found in database for school:', truongKey);
      res.json([]);
    }
  } catch (error) {
    console.error('Error getting majors:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

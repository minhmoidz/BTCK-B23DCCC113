import express from 'express';
import School from '../../models/School.mjs';

const router = express.Router();

// --- API lấy danh sách trường ---
router.get('/truong', async (req, res) => {
  try {
    console.log('Getting schools from database...');
    const schools = await School.find().sort('name');
    console.log(`Found ${schools.length} schools`);
    
    res.json(schools.map(school => ({
      id: school.id,
      name: school.name
    })));
  } catch (error) {
    console.error('Error getting schools:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

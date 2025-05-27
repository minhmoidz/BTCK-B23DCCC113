import express from 'express';
import SubjectGroup from '../../models/SubjectGroup.mjs';

const router = express.Router();

// --- API lấy danh sách tổ hợp môn theo trường và ngành ---
router.get('/tohop/:truongKey/:nganhKey', async (req, res) => {
  try {
    const { truongKey, nganhKey } = req.params;
    console.log('Getting subject groups for:', { truongKey, nganhKey });
    
    const subjectGroups = await SubjectGroup.find({
      schoolId: truongKey,
      majorId: nganhKey
    }).sort('id');
    
    console.log(`Found ${subjectGroups.length} subject groups`);
    
    res.json(subjectGroups.map(group => ({
      id: group.id,
      name: group.name,
      methods: group.methods || ['thpt']
    })));
  } catch (error) {
    console.error('Error getting subject groups:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

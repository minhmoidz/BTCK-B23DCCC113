import express from 'express';
import {
  getNganhByTruong,
  getNganhById,
  createNganh,
  updateNganh
} from '../controllers/nganhController.mjs';

const router = express.Router();

// Routes
router.get('/truong/:truongId', getNganhByTruong);
router.get('/:id', getNganhById);
router.post('/', createNganh);
router.put('/:id', updateNganh);

export default router; 
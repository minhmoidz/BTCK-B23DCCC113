import express from 'express';
import { schoolRoutes } from './schools.mjs';
import { applicationRoutes } from './applications.mjs';
import { statisticsRoutes } from './statistics.mjs';

const router = express.Router();

// Gắn các route con
router.use('/', schoolRoutes);
router.use('/', applicationRoutes);
router.use('/thong-ke', statisticsRoutes);

export { router };

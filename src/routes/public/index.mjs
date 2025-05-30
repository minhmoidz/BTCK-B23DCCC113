import express from 'express';
import { schoolRoutes } from './schools.public.routes.mjs';
import { applicationRoutes } from './applications.public.routes.mjs';
import { statisticsRoutes } from './statistics.public.routes.mjs';

const router = express.Router();

// Gắn các route con
router.use('/', schoolRoutes);
router.use('/', applicationRoutes);
router.use('/thong-ke', statisticsRoutes);

export { router };

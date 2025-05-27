import express from 'express';
import schoolRoutes from './schools.mjs';
import majorRoutes from './majors.mjs';
import subjectGroupRoutes from './subjectGroups.mjs';
import applicationRoutes from './applications.mjs';
import profileRoutes from './profiles.mjs';
import statisticsRoutes from './statistics.mjs';
import admissionMethodRoutes from './admissionMethods.mjs';

const router = express.Router();

// Sử dụng các sub-routes
router.use('/', schoolRoutes);
router.use('/', majorRoutes);
router.use('/', subjectGroupRoutes);
router.use('/', applicationRoutes);
router.use('/', profileRoutes);
router.use('/', statisticsRoutes);
router.use('/', admissionMethodRoutes);

export { router };

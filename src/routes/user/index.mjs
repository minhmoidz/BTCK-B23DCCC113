import express from 'express';
import schoolRoutes from './schools.user.routes.mjs';
import majorRoutes from './majors.user.routes.mjs';
import subjectGroupRoutes from './subjectGroups.user.routes.mjs';
import applicationRoutes from './applications.user.routes.mjs';
import profileRoutes from './profiles.user.routes.mjs';
import statisticsRoutes from './statistics.user.routes.mjs';
import admissionMethodRoutes from './admissionMethods.user.routes.mjs';

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

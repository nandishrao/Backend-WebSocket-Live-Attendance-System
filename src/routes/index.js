import { Router } from 'express';
import authRoutes from './auth.routes.js';
import classRoutes from './class.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', classRoutes);

export default router;
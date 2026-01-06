import express from 'express';
import { getRiskTimeline } from '../controllers/riskTimeline.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:projectId/timeline', protect, getRiskTimeline);

export default router;

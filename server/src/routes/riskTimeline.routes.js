import express from 'express';
import { getRiskTimeline } from '../controllers/riskTimeline.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:projectId/timeline', verifyJWT, getRiskTimeline);
export default router;

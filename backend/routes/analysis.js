import express from 'express';
import { runAnalysis, runRewrite, downloadResume } from '../controllers/analysisController.js';

const router = express.Router();

router.post('/analyze', runAnalysis);
router.post('/rewrite', runRewrite);
router.get('/download/:id', downloadResume);

export default router;

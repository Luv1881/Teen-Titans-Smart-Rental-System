import { Router } from 'express';
import { RevenueController } from './revenue.controller';

const router = Router();

// GET /api/revenue/summary
router.get('/summary', RevenueController.getSummary);

export default router;
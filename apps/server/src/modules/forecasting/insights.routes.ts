import { Router } from 'express';
import { InsightsController } from './insights.controller';

const router = Router();

// GET /api/insights/utilization
router.get('/utilization', InsightsController.getUtilization);

// GET /api/insights/availability
router.get('/availability', InsightsController.getAvailability);

// GET /api/insights/suggestions
router.get('/suggestions', InsightsController.getSuggestions);

// GET /api/insights/forecast
router.get('/forecast', InsightsController.getForecast);

// GET /api/insights/anomalies
router.get('/anomalies', InsightsController.getAnomalies);

export default router;
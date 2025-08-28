import { Router } from 'express';
import { WeatherController } from './weather.controller';

const router = Router();

// GET /api/weather/site/:site_id
router.get('/site/:site_id', WeatherController.getWeatherBySite);

// POST /api/weather/site/:site_id/simulate (for testing)
router.post('/site/:site_id/simulate', WeatherController.simulateWeather);

export default router;
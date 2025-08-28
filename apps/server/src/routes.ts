import { Router } from 'express';
import equipmentRoutes from './modules/equipment/equipment.routes';
import rentalRoutes from './modules/rentals/rentals.routes';
import siteRoutes from './modules/sites/sites.routes';
import insightsRoutes from './modules/forecasting/insights.routes';
import telemetryRoutes from './modules/telemetry/telemetry.routes';
import maintenanceRoutes from './modules/maintenance/maintenance.routes';
import weatherRoutes from './modules/weather/weather.routes';
import revenueRoutes from './modules/revenue/revenue.routes';
import alertsRoutes from './modules/alerts/alerts.routes';
import companyRoutes from './modules/companies/companies.routes';
import operatorRoutes from './modules/operators/operators.routes';

const router = Router();

// Register all routes
router.use('/api/equipment', equipmentRoutes);
router.use('/api/rentals', rentalRoutes);
router.use('/api/sites', siteRoutes);
router.use('/api/insights', insightsRoutes);
router.use('/api/telemetry', telemetryRoutes);
router.use('/api/maintenance', maintenanceRoutes);
router.use('/api/weather', weatherRoutes);
router.use('/api/revenue', revenueRoutes);
router.use('/api/alerts', alertsRoutes);
router.use('/api/companies', companyRoutes);
router.use('/api/operators', operatorRoutes);

export default router;
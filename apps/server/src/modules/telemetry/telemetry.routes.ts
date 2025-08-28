import { Router } from 'express';
import { TelemetryController } from './telemetry.controller';

const router = Router();

// GET /api/telemetry/equipment/:id
router.get('/equipment/:id', TelemetryController.getTelemetryByEquipment);

// POST /api/telemetry/simulate (for testing)
router.post('/simulate', TelemetryController.simulateTelemetry);

export default router;
import { Router } from 'express';
import { MaintenanceController } from './maintenance.controller';

const router = Router();

// GET /api/maintenance
router.get('/', MaintenanceController.getAll);

// GET /api/maintenance/:id
router.get('/:id', MaintenanceController.getById);

// POST /api/maintenance
router.post('/', MaintenanceController.create);

// PATCH /api/maintenance/:id
router.patch('/:id', MaintenanceController.update);

// POST /api/maintenance/:id/complete
router.post('/:id/complete', MaintenanceController.complete);

export default router;
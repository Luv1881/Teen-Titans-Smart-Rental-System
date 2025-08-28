import { Router } from 'express';
import { AlertsController } from './alerts.controller';

const router = Router();

// GET /api/alerts
router.get('/', AlertsController.getAll);

// GET /api/alerts/:id
router.get('/:id', AlertsController.getById);

// POST /api/alerts/:id/dismiss
router.post('/:id/dismiss', AlertsController.dismiss);

export default router;
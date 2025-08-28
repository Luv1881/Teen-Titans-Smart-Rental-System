import { Router } from 'express';
import { EquipmentController } from './equipment.controller';

const router = Router();

// GET /api/equipment
router.get('/', EquipmentController.getAll);

// GET /api/equipment/:id
router.get('/:id', EquipmentController.getById);

// POST /api/equipment
router.post('/', EquipmentController.create);

// PATCH /api/equipment/:id
router.patch('/:id', EquipmentController.update);

export default router;
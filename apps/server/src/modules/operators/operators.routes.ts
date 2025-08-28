import { Router } from 'express';
import { OperatorController } from './operators.controller';

const router = Router();

// GET /api/operators
router.get('/', OperatorController.getAll);

// GET /api/operators/:id
router.get('/:id', OperatorController.getById);

// POST /api/operators
router.post('/', OperatorController.create);

// PATCH /api/operators/:id
router.patch('/:id', OperatorController.update);

export default router;
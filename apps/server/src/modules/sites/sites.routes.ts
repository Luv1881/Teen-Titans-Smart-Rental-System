import { Router } from 'express';
import { SiteController } from './sites.controller';

const router = Router();

// GET /api/sites
router.get('/', SiteController.getAll);

// GET /api/sites/:id
router.get('/:id', SiteController.getById);

// POST /api/sites
router.post('/', SiteController.create);

// PATCH /api/sites/:id
router.patch('/:id', SiteController.update);

export default router;
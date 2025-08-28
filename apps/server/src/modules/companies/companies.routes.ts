import { Router } from 'express';
import { CompanyController } from './companies.controller';

const router = Router();

// GET /api/companies
router.get('/', CompanyController.getAll);

// GET /api/companies/:id
router.get('/:id', CompanyController.getById);

// POST /api/companies
router.post('/', CompanyController.create);

// PATCH /api/companies/:id
router.patch('/:id', CompanyController.update);

export default router;
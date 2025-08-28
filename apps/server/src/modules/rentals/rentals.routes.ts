import { Router } from 'express';
import { RentalController } from './rentals.controller';

const router = Router();

// GET /api/rentals
router.get('/', RentalController.getRentals);

// POST /api/rentals/check-out
router.post('/check-out', RentalController.checkOut);

// POST /api/rentals/check-in
router.post('/check-in', RentalController.checkIn);

export default router;
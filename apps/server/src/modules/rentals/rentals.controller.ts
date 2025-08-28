import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Zod schema for validation
const checkOutSchema = z.object({
  equipment_id: z.number(),
  site_id: z.number(),
  company_id: z.number(),
  operator_id: z.number(),
  expected_return_date: z.string().datetime()
});

const checkInSchema = z.object({
  rental_id: z.number(),
  check_in_date: z.string().datetime(),
  engine_hours_per_day: z.number(),
  idle_hours_per_day: z.number()
});

export class RentalController {
  // Get rentals with filters
  static async getRentals(req: Request, res: Response) {
    try {
      const { status, from, to } = req.query;
      
      const where: any = {};
      
      if (status) {
        where.status = status;
      }
      
      if (from || to) {
        where.check_out_date = {};
        if (from) {
          where.check_out_date.gte = new Date(from as string);
        }
        if (to) {
          where.check_out_date.lte = new Date(to as string);
        }
      }
      
      const rentals = await prisma.rental.findMany({
        where,
        include: {
          equipment: true,
          site: true,
          company: true,
          operator: true
        }
      });
      
      return res.status(200).json(rentals);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch rentals' });
    }
  }

  // Check out equipment
  static async checkOut(req: Request, res: Response) {
    try {
      const validationResult = checkOutSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid request data', details: validationResult.error });
      }
      
      const { equipment_id, site_id, company_id, operator_id, expected_return_date } = validationResult.data;
      
      // Check if equipment exists and is available
      const equipment = await prisma.equipment.findUnique({
        where: { equipment_id }
      });
      
      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' });
      }
      
      if (equipment.status !== 'idle') {
        return res.status(400).json({ error: 'Equipment is not available for rental' });
      }
      
      // Create rental
      const rental = await prisma.rental.create({
        data: {
          equipment_id,
          site_id,
          company_id,
          operator_id,
          check_out_date: new Date(),
          expected_return_date: new Date(expected_return_date),
          status: 'active'
        }
      });
      
      // Update equipment status
      await prisma.equipment.update({
        where: { equipment_id },
        data: { status: 'rented' }
      });
      
      return res.status(201).json(rental);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to check out equipment' });
    }
  }

  // Check in equipment
  static async checkIn(req: Request, res: Response) {
    try {
      const validationResult = checkInSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid request data', details: validationResult.error });
      }
      
      const { rental_id, check_in_date, engine_hours_per_day, idle_hours_per_day } = validationResult.data;
      
      // Find rental
      const rental = await prisma.rental.findUnique({
        where: { rental_id }
      });
      
      if (!rental) {
        return res.status(404).json({ error: 'Rental not found' });
      }
      
      if (rental.status !== 'active') {
        return res.status(400).json({ error: 'Rental is not active' });
      }
      
      // Calculate operating days
      const checkOutDate = new Date(rental.check_out_date);
      const checkIn = new Date(check_in_date);
      const operatingDays = Math.ceil((checkIn.getTime() - checkOutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Update rental
      const updatedRental = await prisma.rental.update({
        where: { rental_id },
        data: {
          check_in_date: checkIn,
          engine_hours_per_day,
          idle_hours_per_day,
          operating_days: operatingDays,
          status: 'returned'
        }
      });
      
      // Update equipment status
      await prisma.equipment.update({
        where: { equipment_id: rental.equipment_id },
        data: { status: 'idle' }
      });
      
      return res.status(200).json(updatedRental);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to check in equipment' });
    }
  }
}
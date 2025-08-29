import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EquipmentController {
  // Get all equipment
  static async getAll(req: Request, res: Response) {
    try {
      const equipment = await prisma.equipment.findMany({
        include: {
          rentals: true,      // include rental records
        }
      });
      return res.status(200).json(equipment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch equipment' });
    }
  }

  // Get equipment by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const equipment = await prisma.equipment.findUnique({
        where: { equipment_id: Number(id) },
        include: {
          rentals: true,
        }
      });

      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' });
      }

      return res.status(200).json(equipment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch equipment' });
    }
  }

  // Create new equipment
  static async create(req: Request, res: Response) {
    try {
      const { equipment_code, type, status } = req.body;

      const equipment = await prisma.equipment.create({
        data: {
          equipment_code,
          type,
          status
        }
      });

      return res.status(201).json(equipment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create equipment' });
    }
  }

  // Update equipment
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { equipment_code, type, status } = req.body;

      const equipment = await prisma.equipment.update({
        where: { equipment_id: Number(id) },
        data: {
          equipment_code,
          type,
          status
        }
      });

      return res.status(200).json(equipment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update equipment' });
    }
  }
}

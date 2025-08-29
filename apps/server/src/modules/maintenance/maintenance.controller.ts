import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MaintenanceController {
  // Get all maintenance records
  static async getAll(req: Request, res: Response) {
    try {
      const maintenance = await prisma.maintenance.findMany({
        include: { equipment: true },
        orderBy: { service_date: 'desc' }
      });

      return res.status(200).json(maintenance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch maintenance records' });
    }
  }

  // Get maintenance by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const maintenance = await prisma.maintenance.findUnique({
        where: { maintenance_id: Number(id) },
        include: { equipment: true }
      });

      if (!maintenance) {
        return res.status(404).json({ error: 'Maintenance record not found' });
      }

      return res.status(200).json(maintenance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch maintenance record' });
    }
  }

  // Create new maintenance record
  static async create(req: Request, res: Response) {
    try {
      const { equipment_id, service_date, service_type, issue_reported, downtime_days } = req.body;

      if (!equipment_id) {
        return res.status(400).json({ error: 'equipment_id is required' });
      }

      const maintenance = await prisma.maintenance.create({
        data: {
          equipment_id,
          service_date: new Date(service_date),
          service_type,
          issue_reported,
          downtime_days
        },
        include: { equipment: true }
      });

      // Update equipment status to maintenance
      await prisma.equipment.update({
        where: { equipment_id },
        data: { status: 'maintenance' }
      });

      return res.status(201).json(maintenance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create maintenance record' });
    }
  }

  // Update maintenance record
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { service_date, service_type, issue_reported, downtime_days } = req.body;

      const maintenance = await prisma.maintenance.update({
        where: { maintenance_id: Number(id) },
        data: {
          service_date: service_date ? new Date(service_date) : undefined,
          service_type,
          issue_reported,
          downtime_days
        },
        include: { equipment: true }
      });

      return res.status(200).json(maintenance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update maintenance record' });
    }
  }

  // Complete maintenance
  static async complete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Update maintenance record with downtime_days if provided
      const maintenance = await prisma.maintenance.update({
        where: { maintenance_id: Number(id) },
        data: {
          downtime_days: req.body.downtime_days
        },
        include: { equipment: true }
      });

      // Update equipment status to idle
      if (maintenance.equipment_id) {
        await prisma.equipment.update({
          where: { equipment_id: maintenance.equipment_id },
          data: { status: 'idle' }
        });
      }

      return res.status(200).json(maintenance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to complete maintenance' });
    }
  }
}

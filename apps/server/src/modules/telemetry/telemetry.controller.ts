import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TelemetryController {
  // Get telemetry data for equipment
  static async getTelemetryByEquipment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      const limitNum = limit ? parseInt(limit as string) : 100;
      
      const telemetry = await prisma.telemetry.findMany({
        where: {
          equipment_id: parseInt(id)
        },
        orderBy: {
          ts: 'desc'
        },
        take: limitNum
      });
      
      return res.status(200).json(telemetry);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch telemetry data' });
    }
  }

  // Simulate telemetry data (for testing/demo)
  static async simulateTelemetry(req: Request, res: Response) {
    try {
      // In a real implementation, this would be a background job
      // that runs periodically to generate realistic telemetry data
      
      // For this prototype, we'll create a single telemetry entry
      const activeRentals = await prisma.rental.findMany({
        where: {
          status: 'active'
        },
        include: {
          equipment: true
        }
      });
      
      if (activeRentals.length === 0) {
        return res.status(200).json({ message: 'No active rentals to simulate' });
      }
      
      // Pick a random active rental
      const randomRental = activeRentals[Math.floor(Math.random() * activeRentals.length)];
      
      // Generate realistic telemetry data
      const telemetryData = {
        equipment_id: randomRental.equipment_id,
        engine_rpm: Math.floor(Math.random() * 2000) + 1000, // 1000-3000 RPM
        fuel_rate_lph: parseFloat((Math.random() * 50 + 10).toFixed(2)), // 10-60 LPH
        gps_lat: randomRental.equipment.site?.latitude 
          ? randomRental.equipment.site.latitude + (Math.random() - 0.5) * 0.01
          : 13.2433 + (Math.random() - 0.5) * 0.01,
        gps_lng: randomRental.equipment.site?.longitude 
          ? randomRental.equipment.site.longitude + (Math.random() - 0.5) * 0.01
          : 77.7123 + (Math.random() - 0.5) * 0.01,
        is_idle: Math.random() > 0.7 // 30% chance of being idle
      };
      
      const telemetry = await prisma.telemetry.create({
        data: telemetryData
      });
      
      // Emit real-time update via Socket.IO
      // In a real implementation, we would have access to the IO instance
      // io.of('/telemetry').emit('update', telemetry);
      
      return res.status(201).json(telemetry);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to simulate telemetry data' });
    }
  }
}
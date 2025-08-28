import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AlertsController {
  // Get all alerts
  static async getAll(req: Request, res: Response) {
    try {
      // In a real implementation, this would query various sources for alerts
      // For this prototype, we'll return sample alerts
      
      const alerts = [
        {
          id: 1,
          type: 'overdue',
          equipmentCode: 'CRN2002',
          message: 'Rental overdue by 5 days',
          severity: 'high',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          id: 2,
          type: 'maintenance',
          equipmentCode: 'EXC1001',
          message: 'Scheduled preventive maintenance due',
          severity: 'medium',
          timestamp: new Date()
        },
        {
          id: 3,
          type: 'anomaly',
          equipmentCode: 'BLD3003',
          message: 'High idle time detected (75% of operating hours)',
          severity: 'medium',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          id: 4,
          type: 'geofence',
          equipmentCode: 'LDR4004',
          message: 'Equipment moved outside designated site perimeter',
          severity: 'high',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        }
      ];
      
      return res.status(200).json(alerts);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  }

  // Get alert by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // In a real implementation, this would fetch a specific alert
      // For this prototype, we'll return a sample alert
      const alert = {
        id: parseInt(id),
        type: 'overdue',
        equipmentCode: 'CRN2002',
        message: 'Rental overdue by 5 days',
        severity: 'high',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        details: {
          equipment: {
            id: 2,
            code: 'CRN2002',
            type: 'Crane',
            site: 'Site S003'
          },
          rental: {
            id: 15,
            company: 'XYZ Heavy Machinery',
            checkoutDate: '2023-06-10',
            expectedReturn: '2023-06-20'
          }
        }
      };
      
      return res.status(200).json(alert);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch alert' });
    }
  }

  // Dismiss an alert
  static async dismiss(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // In a real implementation, this would mark an alert as dismissed
      // For this prototype, we'll just return success
      return res.status(200).json({ 
        message: `Alert ${id} dismissed successfully`,
        dismissedAt: new Date()
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to dismiss alert' });
    }
  }
}
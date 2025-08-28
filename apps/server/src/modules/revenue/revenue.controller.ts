import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RevenueController {
  // Get revenue summary
  static async getSummary(req: Request, res: Response) {
    try {
      const { from, to } = req.query;
      
      const fromDate = from ? new Date(from as string) : new Date(new Date().setDate(new Date().getDate() - 30));
      const toDate = to ? new Date(to as string) : new Date();
      
      const revenue = await prisma.revenue.findMany({
        where: {
          created_at: {
            gte: fromDate,
            lte: toDate
          }
        },
        include: {
          equipment: true,
          rental: true
        }
      });
      
      // Calculate summary statistics
      const totalRevenue = revenue.reduce((sum, r) => sum + r.total_cost, 0);
      const averageRevenuePerRental = revenue.length > 0 ? totalRevenue / revenue.length : 0;
      
      // Group by equipment type
      const revenueByEquipmentType: { [key: string]: number } = {};
      revenue.forEach(r => {
        const type = r.equipment.type;
        revenueByEquipmentType[type] = (revenueByEquipmentType[type] || 0) + r.total_cost;
      });
      
      return res.status(200).json({
        totalRevenue,
        averageRevenuePerRental,
        revenueByEquipmentType,
        period: {
          from: fromDate,
          to: toDate
        },
        records: revenue.length
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch revenue summary' });
    }
  }
}
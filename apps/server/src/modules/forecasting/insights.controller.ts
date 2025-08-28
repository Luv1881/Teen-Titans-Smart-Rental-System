import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { doubleExponentialSmoothing, movingAverageForecast } from './forecasting.utils';

const prisma = new PrismaClient();

export class InsightsController {
  // Get utilization metrics
  static async getUtilization(req: Request, res: Response) {
    try {
      const { window } = req.query;
      const days = window === '30' ? 30 : 7;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Calculate utilization percentage
      const totalEquipment = await prisma.equipment.count();
      const rentedEquipment = await prisma.rental.count({
        where: {
          status: 'active',
          check_out_date: {
            gte: startDate
          }
        }
      });
      
      const utilization = totalEquipment > 0 ? (rentedEquipment / totalEquipment) * 100 : 0;
      
      return res.status(200).json({
        period: days,
        utilization: parseFloat(utilization.toFixed(2)),
        totalEquipment,
        rentedEquipment
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch utilization data' });
    }
  }

  // Get availability metrics
  static async getAvailability(req: Request, res: Response) {
    try {
      const totalEquipment = await prisma.equipment.count();
      const idleEquipment = await prisma.equipment.count({
        where: {
          status: 'idle'
        }
      });
      
      const availability = totalEquipment > 0 ? (idleEquipment / totalEquipment) * 100 : 0;
      
      // Get equipment by status
      const statusCounts = await prisma.equipment.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      });
      
      return res.status(200).json({
        availability: parseFloat(availability.toFixed(2)),
        totalEquipment,
        idleEquipment,
        statusBreakdown: statusCounts.map(item => ({
          status: item.status,
          count: item._count.status
        }))
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch availability data' });
    }
  }

  // Get smart suggestions
  static async getSuggestions(req: Request, res: Response) {
    try {
      const { site_id } = req.query;
      
      // In a real implementation, this would:
      // 1. Fetch weather data for the site
      // 2. Analyze historical demand patterns
      // 3. Check company reliability scores
      // 4. Consider current fleet availability
      // 5. Review maintenance schedules
      
      // For this prototype, we'll return sample suggestions
      const suggestions = [
        {
          id: 1,
          type: 'weather',
          score: 0.85,
          title: 'Pre-position Crane for Rainy Days',
          description: 'Pre-position 1 Crane at Site S003 tomorrow (rain forecast; crane demand historically spikes on wet days).',
          equipmentType: 'Crane',
          siteId: 3,
          priority: 'high'
        },
        {
          id: 2,
          type: 'maintenance',
          score: 0.75,
          title: 'Schedule Preventive Maintenance',
          description: 'Advance preventive maintenance for EQX1004 next Tuesday (low utilization + part lead time).',
          equipmentCode: 'EXC1004',
          priority: 'medium'
        },
        {
          id: 3,
          type: 'utilization',
          score: 0.65,
          title: 'Optimize Equipment Distribution',
          description: 'Excavator utilization at Site S001 is 85% (above target). Consider adding 1 unit next week.',
          equipmentType: 'Excavator',
          siteId: 1,
          priority: 'medium'
        }
      ];
      
      return res.status(200).json(suggestions);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  }

  // Get demand forecast
  static async getForecast(req: Request, res: Response) {
    try {
      const { site_id, type, horizon } = req.query;
      const forecastHorizon = horizon ? parseInt(horizon as string) : 14;
      
      // Fetch historical rental data for the site and equipment type
      const rentals = await prisma.rental.findMany({
        where: {
          site_id: site_id ? parseInt(site_id as string) : undefined,
          equipment: {
            type: type as string
          },
          status: 'returned',
          check_out_date: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) // Last 6 months
          }
        },
        include: {
          equipment: true
        },
        orderBy: {
          check_out_date: 'asc'
        }
      });
      
      // Transform data into daily demand series
      const demandByDate: { [key: string]: number } = {};
      
      rentals.forEach(rental => {
        const dateStr = rental.check_out_date.toISOString().split('T')[0];
        demandByDate[dateStr] = (demandByDate[dateStr] || 0) + 1;
      });
      
      // Sort dates and extract values
      const sortedDates = Object.keys(demandByDate).sort();
      const demandValues = sortedDates.map(date => demandByDate[date]);
      
      // Generate forecast
      let forecastResult;
      if (demandValues.length >= 14) {
        // Use double exponential smoothing for sufficient data
        forecastResult = doubleExponentialSmoothing(demandValues, 0.3, 0.1, forecastHorizon);
      } else if (demandValues.length > 0) {
        // Use moving average for limited data
        forecastResult = movingAverageForecast(demandValues, 7, forecastHorizon);
      } else {
        // No data - return zeros
        forecastResult = {
          forecast: Array(forecastHorizon).fill(0),
          confidenceUpper: Array(forecastHorizon).fill(0),
          confidenceLower: Array(forecastHorizon).fill(0)
        };
      }
      
      // Generate date labels for forecast
      const lastDate = sortedDates.length > 0 
        ? new Date(sortedDates[sortedDates.length - 1]) 
        : new Date();
      
      const forecastDates: string[] = [];
      for (let i = 1; i <= forecastHorizon; i++) {
        const forecastDate = new Date(lastDate);
        forecastDate.setDate(lastDate.getDate() + i);
        forecastDates.push(forecastDate.toISOString().split('T')[0]);
      }
      
      return res.status(200).json({
        siteId: site_id,
        equipmentType: type,
        horizon: forecastHorizon,
        historicalData: {
          dates: sortedDates,
          values: demandValues
        },
        forecast: {
          dates: forecastDates,
          values: forecastResult.forecast,
          confidenceUpper: forecastResult.confidenceUpper,
          confidenceLower: forecastResult.confidenceLower
        }
      });
    } catch (error) {
      console.error('Forecast error:', error);
      return res.status(500).json({ error: 'Failed to generate forecast' });
    }
  }

  // Get anomaly reports
  static async getAnomalies(req: Request, res: Response) {
    try {
      const { window } = req.query;
      const days = window ? parseInt(window as string) : 7;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Find equipment with high idle time (anomaly detection)
      const rentals = await prisma.rental.findMany({
        where: {
          status: 'returned',
          check_in_date: {
            gte: startDate
          },
          idle_hours_per_day: {
            not: null
          },
          engine_hours_per_day: {
            not: null
          }
        }
      });
      
      // Detect anomalies: idle hours > 60% of engine hours
      const anomalies = rentals.filter(rental => {
        if (rental.idle_hours_per_day && rental.engine_hours_per_day) {
          return rental.idle_hours_per_day > rental.engine_hours_per_day * 0.6;
        }
        return false;
      });
      
      // Find unassigned equipment (idle but site has demand)
      const unassignedEquipment = await prisma.equipment.findMany({
        where: {
          status: 'idle',
          site_id: null
        }
      });
      
      return res.status(200).json({
        period: days,
        utilizationAnomalies: anomalies.map(rental => ({
          rentalId: rental.rental_id,
          equipmentId: rental.equipment_id,
          idleHours: rental.idle_hours_per_day,
          engineHours: rental.engine_hours_per_day,
          idlePercentage: rental.engine_hours_per_day && rental.idle_hours_per_day 
            ? (rental.idle_hours_per_day / rental.engine_hours_per_day) * 100
            : 0
        })),
        unassignedEquipment: unassignedEquipment.map(eq => ({
          equipmentId: eq.equipment_id,
          equipmentCode: eq.equipment_code,
          type: eq.type
        }))
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch anomaly data' });
    }
  }
}
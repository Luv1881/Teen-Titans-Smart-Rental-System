import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WeatherController {
  // Get weather data for a site
  static async getWeatherBySite(req: Request, res: Response) {
    try {
      const { site_id } = req.params;
      const { range } = req.query;
      const days = range ? parseInt(range as string) : 7;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const weather = await prisma.weatherCache.findMany({
        where: {
          site_id: parseInt(site_id),
          date: {
            gte: startDate
          }
        },
        orderBy: {
          date: 'asc'
        }
      });
      
      return res.status(200).json(weather);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }

  // Simulate weather data (for testing/demo)
  static async simulateWeather(req: Request, res: Response) {
    try {
      // In a real implementation, this would fetch from a weather API
      // For this prototype, we'll create sample weather data
      
      const { site_id } = req.params;
      
      // Check if we already have cached data
      const existing = await prisma.weatherCache.findFirst({
        where: {
          site_id: parseInt(site_id),
          date: new Date()
        }
      });
      
      if (existing) {
        return res.status(200).json({ message: 'Weather data already cached' });
      }
      
      // Generate sample weather data
      const weatherData = {
        site_id: parseInt(site_id),
        date: new Date(),
        temp_c: parseFloat((Math.random() * 30 + 10).toFixed(1)), // 10-40°C
        precipitation_mm: parseFloat((Math.random() * 10).toFixed(1)), // 0-10mm
        wind_kph: parseFloat((Math.random() * 30).toFixed(1)) // 0-30 km/h
      };
      
      const weather = await prisma.weatherCache.create({
        data: weatherData
      });
      
      return res.status(201).json(weather);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to simulate weather data' });
    }
  }
}
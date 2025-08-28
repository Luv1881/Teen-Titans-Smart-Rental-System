import { Request, Response } from 'express';
import { forecastingService } from './forecasting.service';

export class ForecastingController {
  async getForecast(req: Request, res: Response) {
    try {
      const { site_id, type, horizon } = req.query;
      
      if (!site_id || !type) {
        return res.status(400).json({ 
          error: 'site_id and type are required parameters' 
        });
      }
      
      const siteId = parseInt(site_id as string);
      const equipmentType = type as string;
      const forecastHorizon = horizon ? parseInt(horizon as string) : 14;
      
      if (isNaN(siteId) || forecastHorizon <= 0) {
        return res.status(400).json({ 
          error: 'Invalid site_id or horizon parameters' 
        });
      }
      
      // Get forecast
      const forecast = await forecastingService.forecast(
        siteId, 
        equipmentType, 
        forecastHorizon
      );
      
      res.json(forecast);
    } catch (error) {
      console.error('Forecasting error:', error);
      res.status(500).json({ 
        error: 'Failed to generate forecast' 
      });
    }
  }
  
  async trainModel(req: Request, res: Response) {
    try {
      const { site_id, type } = req.body;
      
      if (!site_id || !type) {
        return res.status(400).json({ 
          error: 'site_id and type are required in request body' 
        });
      }
      
      const siteId = parseInt(site_id);
      const equipmentType = type;
      
      if (isNaN(siteId)) {
        return res.status(400).json({ 
          error: 'Invalid site_id parameter' 
        });
      }
      
      // Train the model
      await forecastingService.trainModel(siteId, equipmentType);
      
      res.json({ 
        message: 'Model trained successfully' 
      });
    } catch (error) {
      console.error('Training error:', error);
      res.status(500).json({ 
        error: 'Failed to train model' 
      });
    }
  }
}

export const forecastingController = new ForecastingController();
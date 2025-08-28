import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Recursive Least Squares with forgetting factor
class RLS {
  private theta: number[]; // Model parameters
  private P: number[][];   // Covariance matrix
  private lambda: number;  // Forgetting factor

  constructor(dim: number, lambda: number = 0.98) {
    this.lambda = lambda;
    this.theta = new Array(dim).fill(0);
    
    // Initialize covariance matrix
    this.P = Array(dim).fill(0).map(() => new Array(dim).fill(0));
    for (let i = 0; i < dim; i++) {
      this.P[i][i] = 1000; // Large initial values
    }
  }

  update(x: number[], y: number): void {
    // Prediction error
    const prediction = this.predict(x);
    const error = y - prediction;

    // Update steps
    const Px = this.P.map(row => row.reduce((sum, val, i) => sum + val * x[i], 0));
    const xPx = x.reduce((sum, val, i) => sum + val * Px[i], 0);
    const denominator = this.lambda + xPx;
    
    // Update covariance matrix
    const newP = Array(this.P.length).fill(0).map(() => new Array(this.P[0].length).fill(0));
    for (let i = 0; i < this.P.length; i++) {
      for (let j = 0; j < this.P[0].length; j++) {
        newP[i][j] = (this.P[i][j] - (Px[i] * Px[j]) / denominator) / this.lambda;
      }
    }
    this.P = newP;

    // Update parameters
    for (let i = 0; i < this.theta.length; i++) {
      this.theta[i] += (error * Px[i]) / denominator;
    }
  }

  predict(x: number[]): number {
    return x.reduce((sum, val, i) => sum + val * this.theta[i], 0);
  }

  getState(): { theta: number[], P: number[][] } {
    return {
      theta: [...this.theta],
      P: this.P.map(row => [...row])
    };
  }

  setState(state: { theta: number[], P: number[][] }): void {
    this.theta = [...state.theta];
    this.P = state.P.map(row => [...row]);
  }
}

// Forecasting service
export class ForecastingService {
  private models: Map<string, RLS> = new Map();
  private modelStates: Map<string, any> = new Map();

  async initialize(): Promise<void> {
    // Load model states from database
    const savedStates = await prisma.forecast_state.findMany();
    for (const state of savedStates) {
      const model = new RLS(10); // 10 features
      try {
        const modelState = JSON.parse(state.model_state);
        model.setState(modelState);
        this.models.set(`${state.site_id}-${state.equipment_type}`, model);
        this.modelStates.set(`${state.site_id}-${state.equipment_type}`, modelState);
      } catch (e) {
        console.error('Failed to load model state:', e);
      }
    }
  }

  async getDailyUsage(siteId: number, equipmentType: string): Promise<{ date: string; usage: number }[]> {
    // This would aggregate actual usage data from rentals and telemetry
    // For now, we'll return mock data
    const today = new Date();
    const data = [];
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Mock usage data
      const usage = Math.floor(Math.random() * 10) + 1;
      data.push({ date: dateString, usage });
    }
    
    return data;
  }

  async getWeatherFeatures(siteId: number, date: Date): Promise<number[]> {
    // Get weather data for the date
    const weather = await prisma.weather_cache.findFirst({
      where: {
        site_id: siteId,
        date: date
      }
    });
    
    if (weather) {
      return [
        weather.temp_c ?? 0,
        weather.precipitation_mm ?? 0,
        weather.wind_kph ?? 0
      ];
    }
    
    return [0, 0, 0]; // Default values if no weather data
  }

  async trainModel(siteId: number, equipmentType: string): Promise<void> {
    const key = `${siteId}-${equipmentType}`;
    let model = this.models.get(key);
    
    if (!model) {
      model = new RLS(10); // 10 features: y[t-1], y[t-7], dow_onehot(7), weather(3)
      this.models.set(key, model);
    }
    
    // Get daily usage data
    const usageData = await this.getDailyUsage(siteId, equipmentType);
    
    if (usageData.length < 2) {
      return; // Not enough data to train
    }
    
    // Train the model with historical data
    for (let i = 7; i < usageData.length; i++) {
      const currentDate = new Date(usageData[i].date);
      
      // Features: [y[t-1], y[t-7], dow_onehot(7), weather(3)]
      const features = new Array(10).fill(0);
      
      // Lag features
      features[0] = usageData[i-1].usage; // y[t-1]
      features[1] = usageData[i-7].usage; // y[t-7]
      
      // Day of week one-hot encoding
      const dayOfWeek = currentDate.getDay();
      features[2 + dayOfWeek] = 1;
      
      // Weather features
      const weatherFeatures = await this.getWeatherFeatures(siteId, currentDate);
      features[9] = weatherFeatures[0]; // temp
      features[10] = weatherFeatures[1]; // precipitation
      features[11] = weatherFeatures[2]; // wind
      
      // Update model
      model.update(features.slice(0, 10), usageData[i].usage);
    }
    
    // Save model state
    const state = model.getState();
    this.modelStates.set(key, state);
    
    // Persist to database
    try {
      await prisma.forecast_state.upsert({
        where: {
          site_id_equipment_type: {
            site_id: siteId,
            equipment_type: equipmentType
          }
        },
        update: {
          model_state: JSON.stringify(state),
          updated_at: new Date()
        },
        create: {
          site_id: siteId,
          equipment_type: equipmentType,
          model_state: JSON.stringify(state),
          updated_at: new Date()
        }
      });
    } catch (e) {
      console.error('Failed to save model state:', e);
    }
  }

  async forecast(siteId: number, equipmentType: string, horizon: number = 14): Promise<{ 
    history: { date: string; actual: number | null; forecast: number | null }[]; 
    predictions: { date: string; pred: number; lower: number; upper: number }[] 
  }> {
    const key = `${siteId}-${equipmentType}`;
    let model = this.models.get(key);
    
    if (!model) {
      // Try to load from database
      const savedState = await prisma.forecast_state.findUnique({
        where: {
          site_id_equipment_type: {
            site_id: siteId,
            equipment_type: equipmentType
          }
        }
      });
      
      if (savedState) {
        try {
          const modelState = JSON.parse(savedState.model_state);
          model = new RLS(10);
          model.setState(modelState);
          this.models.set(key, model);
        } catch (e) {
          console.error('Failed to load model state:', e);
        }
      }
    }
    
    // Get historical data
    const usageData = await this.getDailyUsage(siteId, equipmentType);
    
    // If we don't have enough data, use moving average
    if (usageData.length < 14) {
      const avg = usageData.reduce((sum, d) => sum + d.usage, 0) / usageData.length;
      const predictions = [];
      
      const today = new Date();
      for (let i = 1; i <= horizon; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        predictions.push({
          date: dateString,
          pred: avg,
          lower: Math.max(0, avg - 2),
          upper: avg + 2
        });
      }
      
      return {
        history: usageData.map(d => ({ date: d.date, actual: d.usage, forecast: null })),
        predictions
      };
    }
    
    // Use the model for forecasting
    if (model) {
      // Prepare history data
      const history = usageData.map(d => ({ date: d.date, actual: d.usage, forecast: null }));
      
      // Generate forecasts
      const predictions = [];
      let lastWeekData = [...usageData];
      
      const today = new Date();
      for (let i = 1; i <= horizon; i++) {
        const forecastDate = new Date(today);
        forecastDate.setDate(forecastDate.getDate() + i);
        const dateString = forecastDate.toISOString().split('T')[0];
        
        // Features for prediction
        const features = new Array(10).fill(0);
        
        // Lag features (use last predicted values if needed)
        features[0] = lastWeekData[lastWeekData.length - 1].usage; // y[t-1]
        features[1] = lastWeekData[lastWeekData.length - 7].usage; // y[t-7]
        
        // Day of week one-hot encoding
        const dayOfWeek = forecastDate.getDay();
        features[2 + dayOfWeek] = 1;
        
        // Weather features (use forecast or average)
        const weatherFeatures = await this.getWeatherFeatures(siteId, forecastDate);
        features[9] = weatherFeatures[0]; // temp
        features[10] = weatherFeatures[1]; // precipitation
        features[11] = weatherFeatures[2]; // wind
        
        // Make prediction
        const pred = model.predict(features.slice(0, 10));
        const lower = Math.max(0, pred - 2); // Simple confidence interval
        const upper = pred + 2;
        
        predictions.push({
          date: dateString,
          pred,
          lower,
          upper
        });
        
        // Add to lastWeekData for next iteration
        lastWeekData.push({ date: dateString, usage: pred });
        if (lastWeekData.length > 7) {
          lastWeekData.shift();
        }
      }
      
      return { history, predictions };
    }
    
    // Fallback to moving average
    const avg = usageData.reduce((sum, d) => sum + d.usage, 0) / usageData.length;
    const predictions = [];
    
    const today = new Date();
    for (let i = 1; i <= horizon; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      predictions.push({
        date: dateString,
        pred: avg,
        lower: Math.max(0, avg - 2),
        upper: avg + 2
      });
    }
    
    return {
      history: usageData.map(d => ({ date: d.date, actual: d.usage, forecast: null })),
      predictions
    };
  }
}

// Export singleton instance
export const forecastingService = new ForecastingService();
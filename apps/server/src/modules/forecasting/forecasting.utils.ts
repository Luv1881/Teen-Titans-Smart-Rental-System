// Simple exponential smoothing (Holt-Winters) implementation
// Based on https://en.wikipedia.org/wiki/Exponential_smoothing

export interface ForecastResult {
  forecast: number[];
  confidenceUpper: number[];
  confidenceLower: number[];
}

/**
 * Simple exponential smoothing (SES) - for data without trend or seasonality
 * @param data - Time series data
 * @param alpha - Smoothing parameter (0 < alpha < 1)
 * @returns Forecast for next period
 */
export function simpleExponentialSmoothing(data: number[], alpha: number = 0.3): number {
  if (data.length === 0) return 0;
  if (data.length === 1) return data[0];
  
  let smoothed = data[0];
  for (let i = 1; i < data.length; i++) {
    smoothed = alpha * data[i] + (1 - alpha) * smoothed;
  }
  
  return smoothed;
}

/**
 * Double exponential smoothing (Holt's method) - for data with trend
 * @param data - Time series data
 * @param alpha - Smoothing parameter for level (0 < alpha < 1)
 * @param beta - Smoothing parameter for trend (0 < beta < 1)
 * @param periods - Number of periods to forecast
 * @returns Forecast results
 */
export function doubleExponentialSmoothing(
  data: number[], 
  alpha: number = 0.3, 
  beta: number = 0.1,
  periods: number = 7
): ForecastResult {
  if (data.length === 0) {
    return {
      forecast: Array(periods).fill(0),
      confidenceUpper: Array(periods).fill(0),
      confidenceLower: Array(periods).fill(0)
    };
  }
  
  if (data.length === 1) {
    return {
      forecast: Array(periods).fill(data[0]),
      confidenceUpper: Array(periods).fill(data[0] * 1.1),
      confidenceLower: Array(periods).fill(data[0] * 0.9)
    };
  }
  
  // Initialize level and trend
  let level = data[0];
  let trend = data[1] - data[0];
  
  // Store historical values for calculating residuals
  const fittedValues: number[] = [data[0]];
  
  // Smoothing
  for (let i = 1; i < data.length; i++) {
    const previousLevel = level;
    level = alpha * data[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - previousLevel) + (1 - beta) * trend;
    fittedValues.push(level + trend);
  }
  
  // Forecast
  const forecast: number[] = [];
  for (let i = 1; i <= periods; i++) {
    forecast.push(level + i * trend);
  }
  
  // Calculate residuals for confidence intervals
  const residuals: number[] = [];
  for (let i = 0; i < data.length; i++) {
    residuals.push(data[i] - fittedValues[i]);
  }
  
  // Calculate standard deviation of residuals
  const meanResidual = residuals.reduce((sum, r) => sum + r, 0) / residuals.length;
  const residualVariance = residuals.reduce((sum, r) => sum + Math.pow(r - meanResidual, 2), 0) / residuals.length;
  const residualStd = Math.sqrt(residualVariance);
  
  // Confidence intervals (±1.5 * residual std)
  const confidenceUpper = forecast.map(val => val + 1.5 * residualStd);
  const confidenceLower = forecast.map(val => Math.max(0, val - 1.5 * residualStd));
  
  return {
    forecast,
    confidenceUpper,
    confidenceLower
  };
}

/**
 * Fallback method: Simple moving average
 * @param data - Time series data
 * @param window - Window size for moving average
 * @param periods - Number of periods to forecast
 * @returns Forecast results
 */
export function movingAverageForecast(
  data: number[], 
  window: number = 7,
  periods: number = 7
): ForecastResult {
  if (data.length === 0) {
    return {
      forecast: Array(periods).fill(0),
      confidenceUpper: Array(periods).fill(0),
      confidenceLower: Array(periods).fill(0)
    };
  }
  
  // Calculate moving average
  const sum = data.slice(-window).reduce((acc, val) => acc + val, 0);
  const avg = sum / Math.min(window, data.length);
  
  // Forecast
  const forecast = Array(periods).fill(avg);
  
  // Calculate standard deviation for confidence intervals
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  const std = Math.sqrt(variance);
  
  // Confidence intervals (±1.5 * std)
  const confidenceUpper = forecast.map(val => val + 1.5 * std);
  const confidenceLower = forecast.map(val => Math.max(0, val - 1.5 * std));
  
  return {
    forecast,
    confidenceUpper,
    confidenceLower
  };
}
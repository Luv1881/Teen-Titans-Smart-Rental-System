import { simpleExponentialSmoothing, doubleExponentialSmoothing, movingAverageForecast } from './forecasting.utils';

describe('Forecasting Utilities', () => {
  describe('simpleExponentialSmoothing', () => {
    it('should return 0 for empty data', () => {
      expect(simpleExponentialSmoothing([])).toBe(0);
    });

    it('should return the same value for single data point', () => {
      expect(simpleExponentialSmoothing([5])).toBe(5);
    });

    it('should calculate exponential smoothing correctly', () => {
      const data = [10, 12, 13, 12, 15, 16, 14];
      const result = simpleExponentialSmoothing(data, 0.3);
      expect(result).toBeCloseTo(13.92, 2);
    });
  });

  describe('doubleExponentialSmoothing', () => {
    it('should handle empty data', () => {
      const result = doubleExponentialSmoothing([], 0.3, 0.1, 3);
      expect(result.forecast).toEqual([0, 0, 0]);
    });

    it('should handle single data point', () => {
      const result = doubleExponentialSmoothing([10], 0.3, 0.1, 3);
      expect(result.forecast).toEqual([10, 10, 10]);
    });

    it('should calculate double exponential smoothing', () => {
      const data = [10, 12, 13, 12, 15, 16, 14, 18, 20, 19];
      const result = doubleExponentialSmoothing(data, 0.3, 0.1, 3);
      
      // Check that we get 3 forecast values
      expect(result.forecast).toHaveLength(3);
      
      // Check that forecasts are reasonable (positive and increasing)
      result.forecast.forEach(val => {
        expect(val).toBeGreaterThan(0);
      });
    });
  });

  describe('movingAverageForecast', () => {
    it('should handle empty data', () => {
      const result = movingAverageForecast([], 7, 3);
      expect(result.forecast).toEqual([0, 0, 0]);
    });

    it('should calculate moving average forecast', () => {
      const data = [10, 12, 13, 12, 15, 16, 14];
      const result = movingAverageForecast(data, 7, 3);
      const expectedAvg = (10 + 12 + 13 + 12 + 15 + 16 + 14) / 7;
      
      expect(result.forecast).toEqual([expectedAvg, expectedAvg, expectedAvg]);
    });

    it('should calculate confidence intervals', () => {
      const data = [10, 12, 13, 12, 15, 16, 14];
      const result = movingAverageForecast(data, 7, 3);
      
      // Confidence bounds should exist and be in correct order
      expect(result.confidenceUpper.length).toBe(3);
      expect(result.confidenceLower.length).toBe(3);
      
      for (let i = 0; i < 3; i++) {
        expect(result.confidenceUpper[i]).toBeGreaterThanOrEqual(result.forecast[i]);
        expect(result.confidenceLower[i]).toBeLessThanOrEqual(result.forecast[i]);
      }
    });
  });
});
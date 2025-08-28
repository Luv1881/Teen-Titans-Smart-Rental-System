'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Forecasting() {
  const [site, setSite] = useState('S001');
  const [type, setType] = useState('Excavator');
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchForecastData();
  }, [site, type]);

  const fetchForecastData = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the actual API endpoint
      // const response = await fetch(`/api/insights/forecast?site_id=${site}&type=${type}&horizon=14`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockHistory = [
        { date: '2023-06-01', actual: 4, forecast: null },
        { date: '2023-06-02', actual: 5, forecast: null },
        { date: '2023-06-03', actual: 3, forecast: null },
        { date: '2023-06-04', actual: 6, forecast: null },
        { date: '2023-06-05', actual: 4, forecast: null },
        { date: '2023-06-06', actual: 7, forecast: null },
        { date: '2023-06-07', actual: 5, forecast: null },
      ];
      
      const mockForecast = [
        { date: '2023-06-08', actual: null, forecast: 6, lower: 4, upper: 8 },
        { date: '2023-06-09', actual: null, forecast: 7, lower: 5, upper: 9 },
        { date: '2023-06-10', actual: null, forecast: 5, lower: 3, upper: 7 },
        { date: '2023-06-11', actual: null, forecast: 8, lower: 6, upper: 10 },
        { date: '2023-06-12', actual: null, forecast: 6, lower: 4, upper: 8 },
        { date: '2023-06-13', actual: null, forecast: 7, lower: 5, upper: 9 },
        { date: '2023-06-14', actual: null, forecast: 9, lower: 7, upper: 11 },
      ];
      
      // Combine history and forecast for the chart
      const combinedData = [...mockHistory, ...mockForecast];
      setForecastData(combinedData);
      
      // Mock weather data
      const mockWeather = [
        { day: 'Jun 1', rain: 0, wind: 5 },
        { day: 'Jun 2', rain: 2, wind: 7 },
        { day: 'Jun 3', rain: 0, wind: 3 },
        { day: 'Jun 4', rain: 5, wind: 10 },
        { day: 'Jun 5', rain: 1, wind: 6 },
        { day: 'Jun 6', rain: 0, wind: 4 },
        { day: 'Jun 7', rain: 3, wind: 8 }
      ];
      
      setWeatherData(mockWeather);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-cat-dark">Demand Forecasting</h1>
        <button 
          className="cat-button flex items-center"
          onClick={fetchForecastData}
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
      
      {/* Filters */}
      <div className="cat-card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
            <select 
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            >
              <option value="S001">Site S001 - Bengaluru</option>
              <option value="S002">Site S002 - Chennai</option>
              <option value="S003">Site S003 - Hyderabad</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            >
              <option value="Excavator">Excavator</option>
              <option value="Crane">Crane</option>
              <option value="Bulldozer">Bulldozer</option>
              <option value="Loader">Loader</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Forecast Chart */}
      <div className="cat-card mb-8">
        <h2 className="text-xl font-bold mb-4 text-cat-dark">Live Forecast: {type} at {site}</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={forecastData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderColor: '#e5e7eb',
                  color: '#111111'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stackId="1" 
                stroke="#111111" 
                fill="#111111" 
                name="Actual Demand"
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                stackId="2" 
                stroke="#FFC72C" 
                fill="#FFC72C" 
                name="Forecasted Demand"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="#FFC72C"
                fillOpacity={0.1}
                name="Confidence Interval"
              />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="#FFC72C"
                fillOpacity={0.1}
                name="Confidence Interval"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Weather Strip Chart */}
      <div className="cat-card">
        <h2 className="text-xl font-bold mb-4 text-cat-dark">Weather Forecast</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weatherData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderColor: '#e5e7eb',
                  color: '#111111'
                }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="rain" 
                name="Rainfall (mm)" 
                fill="#2196F3" 
              />
              <Bar 
                yAxisId="right" 
                dataKey="wind" 
                name="Wind (km/h)" 
                fill="#FF9800" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
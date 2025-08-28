'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Forecasting() {
  const [site, setSite] = useState('S001');
  const [type, setType] = useState('Excavator');
  
  // Mock data for the chart
  const [forecastData, setForecastData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    // In a real app, this would come from an API
    const mockForecastData = [
      { date: '2023-06-01', actual: 4, forecast: null },
      { date: '2023-06-02', actual: 5, forecast: null },
      { date: '2023-06-03', actual: 3, forecast: null },
      { date: '2023-06-04', actual: 6, forecast: null },
      { date: '2023-06-05', actual: 4, forecast: null },
      { date: '2023-06-06', actual: 7, forecast: null },
      { date: '2023-06-07', actual: 5, forecast: null },
      { date: '2023-06-08', actual: null, forecast: 6 },
      { date: '2023-06-09', actual: null, forecast: 7 },
      { date: '2023-06-10', actual: null, forecast: 5 },
      { date: '2023-06-11', actual: null, forecast: 8 },
      { date: '2023-06-12', actual: null, forecast: 6 },
      { date: '2023-06-13', actual: null, forecast: 7 },
      { date: '2023-06-14', actual: null, forecast: 9 }
    ];
    
    const mockWeatherData = [
      { day: 'Jun 1', rain: 0, wind: 5 },
      { day: 'Jun 2', rain: 2, wind: 7 },
      { day: 'Jun 3', rain: 0, wind: 3 },
      { day: 'Jun 4', rain: 5, wind: 10 },
      { day: 'Jun 5', rain: 1, wind: 6 },
      { day: 'Jun 6', rain: 0, wind: 4 },
      { day: 'Jun 7', rain: 3, wind: 8 }
    ];
    
    setForecastData(mockForecastData);
    setWeatherData(mockWeatherData);
  }, [site, type]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Demand Forecasting</h1>
      
      {/* Filters */}
      <div className="cat-card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
            <select 
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
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
              className="w-full p-2 border border-gray-300 rounded-lg"
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
        <h2 className="text-xl font-bold mb-4">Demand Forecast: {type} at {site}</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={forecastData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
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
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Weather Strip Chart */}
      <div className="cat-card">
        <h2 className="text-xl font-bold mb-4">Weather Forecast</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weatherData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
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
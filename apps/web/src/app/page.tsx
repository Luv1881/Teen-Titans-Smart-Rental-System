'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [kpiData, setKpiData] = useState({
    activeRentals: 0,
    overdue: 0,
    utilization: 0,
    fleetAvailability: 0
  });

  const [equipmentTypeData, setEquipmentTypeData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    // In a real app, this would come from an API
    setKpiData({
      activeRentals: 24,
      overdue: 3,
      utilization: 78,
      fleetAvailability: 65
    });

    setEquipmentTypeData([
      { name: 'Excavators', value: 35 },
      { name: 'Cranes', value: 25 },
      { name: 'Bulldozers', value: 20 },
      { name: 'Loaders', value: 15 },
      { name: 'Graders', value: 5 }
    ]);

    setStatusData([
      { name: 'Rented', value: 45 },
      { name: 'Available', value: 35 },
      { name: 'Maintenance', value: 20 }
    ]);
  }, []);

  const COLORS = ['#FFC72C', '#111111', '#2A2A2A', '#3D3D3D', '#E5E7EB'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="cat-kpi-card">
          <h3 className="text-lg font-semibold mb-2">Active Rentals</h3>
          <p className="text-3xl font-bold text-cat-yellow">{kpiData.activeRentals}</p>
        </div>
        <div className="cat-kpi-card">
          <h3 className="text-lg font-semibold mb-2">Overdue</h3>
          <p className="text-3xl font-bold text-red-500">{kpiData.overdue}</p>
        </div>
        <div className="cat-kpi-card">
          <h3 className="text-lg font-semibold mb-2">Utilization % (7d)</h3>
          <p className="text-3xl font-bold text-cat-yellow">{kpiData.utilization}%</p>
        </div>
        <div className="cat-kpi-card">
          <h3 className="text-lg font-semibold mb-2">Fleet Availability</h3>
          <p className="text-3xl font-bold text-cat-yellow">{kpiData.fleetAvailability}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="cat-card">
          <h2 className="text-xl font-bold mb-4">Equipment Usage by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={equipmentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {equipmentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="cat-card">
          <h2 className="text-xl font-bold mb-4">Equipment Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Suggestions Panel */}
      <div className="cat-card">
        <h2 className="text-xl font-bold mb-4">Smart Suggestions</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="mr-4 bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Weather Alert</h3>
              <p>Pre-position 1 Crane at Site S003 tomorrow (rain forecast; crane demand historically spikes on wet days).</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
            <div className="mr-4 bg-yellow-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Maintenance Recommendation</h3>
              <p>Advance preventive maintenance for EQX1004 next Tuesday (low utilization + part lead time).</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <div className="mr-4 bg-green-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Utilization Insight</h3>
              <p>Excavator utilization at Site S001 is 85% (above target). Consider adding 1 unit next week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

export default function Maintenance() {
  const [maintenance, setMaintenance] = useState([
    {
      id: 1,
      equipmentCode: 'EXC1001',
      equipmentType: 'Excavator',
      serviceDate: '2023-06-15',
      serviceType: 'Preventive',
      status: 'scheduled'
    },
    {
      id: 2,
      equipmentCode: 'CRN2002',
      equipmentType: 'Crane',
      serviceDate: '2023-06-10',
      serviceType: 'Breakdown',
      status: 'in-progress'
    },
    {
      id: 3,
      equipmentCode: 'BLD3003',
      equipmentType: 'Bulldozer',
      serviceDate: '2023-06-05',
      serviceType: 'Preventive',
      status: 'completed'
    }
  ]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Maintenance</h1>
        <button className="cat-button">Schedule Maintenance</button>
      </div>

      {/* Maintenance List */}
      <div className="cat-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenance.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.equipmentCode}</div>
                    <div className="text-sm text-gray-500">{item.equipmentType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.serviceDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.serviceType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
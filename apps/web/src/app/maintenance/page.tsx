'use client';

import { useState } from 'react';
import MaintenanceForm from '@/components/maintenance-form';

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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);

  const getStatusClass = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateMaintenance = async (data) => {
    // In a real app, this would make an API call
    console.log('Creating maintenance:', data);
    // Simulate API call
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleUpdateMaintenance = async (data) => {
    // In a real app, this would make an API call
    console.log('Updating maintenance:', data);
    // Simulate API call
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const openEditForm = (item) => {
    setEditingMaintenance(item);
    setIsFormOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-cat-dark">Maintenance</h1>
        <div className="flex gap-3">
          <button className="cat-button flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
          <button 
            className="cat-button flex items-center"
            onClick={() => {
              setEditingMaintenance(null);
              setIsFormOpen(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Schedule Maintenance
          </button>
        </div>
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
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.equipmentCode}</div>
                    <div className="text-sm text-gray-500">{item.equipmentType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.serviceDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.serviceType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => openEditForm(item)}
                    >
                      Edit
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MaintenanceForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMaintenance(null);
        }}
        onSubmit={editingMaintenance ? handleUpdateMaintenance : handleCreateMaintenance}
        initialData={editingMaintenance}
      />
    </div>
  );
}
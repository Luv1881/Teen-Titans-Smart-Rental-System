'use client';

import { useState } from 'react';
import QRCode from 'qrcode.react';
import EquipmentForm from '@/components/equipment-form';

export default function Equipment() {
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      code: 'EXC1001',
      type: 'Excavator',
      site: 'Site S001',
      status: 'rented'
    },
    {
      id: 2,
      code: 'CRN2002',
      type: 'Crane',
      site: 'Site S003',
      status: 'overdue'
    },
    {
      id: 3,
      code: 'BLD3003',
      type: 'Bulldozer',
      site: 'Site S002',
      status: 'idle'
    },
    {
      id: 4,
      code: 'LDR4004',
      type: 'Loader',
      site: 'Site S001',
      status: 'maintenance'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [showQR, setShowQR] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const filteredEquipment = filter === 'all' 
    ? equipment 
    : equipment.filter(item => item.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case 'idle': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateEquipment = async (data) => {
    // In a real app, this would make an API call
    console.log('Creating equipment:', data);
    // Simulate API call
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleUpdateEquipment = async (data) => {
    // In a real app, this would make an API call
    console.log('Updating equipment:', data);
    // Simulate API call
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const openEditForm = (item) => {
    setEditingEquipment(item);
    setIsFormOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-cat-dark">Equipment</h1>
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
              setEditingEquipment(null);
              setIsFormOpen(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Equipment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="cat-card mb-8">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200 text-cat-dark'}`}
            onClick={() => setFilter('all')}
          >
            All Equipment
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'idle' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200 text-cat-dark'}`}
            onClick={() => setFilter('idle')}
          >
            Idle
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'rented' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200 text-cat-dark'}`}
            onClick={() => setFilter('rented')}
          >
            Rented
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'overdue' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200 text-cat-dark'}`}
            onClick={() => setFilter('overdue')}
          >
            Overdue
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'maintenance' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200 text-cat-dark'}`}
            onClick={() => setFilter('maintenance')}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="cat-card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-cat-dark">{item.code}</h3>
                <p className="text-gray-600">{item.type}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(item.status)}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Current Site</p>
              <p className="font-medium text-cat-dark">{item.site || 'Unassigned'}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-900"
                onClick={() => setShowQR(item)}
              >
                Show QR Code
              </button>
              <button 
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={() => openEditForm(item)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-center text-cat-dark">QR Code for {showQR.code}</h3>
            <div className="flex justify-center mb-4">
              <QRCode value={showQR.code} size={200} bgColor="#ffffff" fgColor="#000000" />
            </div>
            <p className="text-center mb-4 text-gray-700">Scan to view equipment details</p>
            <div className="text-center">
              <button 
                className="cat-button"
                onClick={() => setShowQR(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <EquipmentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEquipment(null);
        }}
        onSubmit={editingEquipment ? handleUpdateEquipment : handleCreateEquipment}
        initialData={editingEquipment}
      />
    </div>
  );
}
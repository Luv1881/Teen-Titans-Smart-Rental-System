'use client';

import { useState } from 'react';
import QRCode from 'qrcode.react';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Equipment</h1>
        <button className="cat-button">Add Equipment</button>
      </div>

      {/* Filters */}
      <div className="cat-card mb-8">
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All Equipment
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'idle' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200'}`}
            onClick={() => setFilter('idle')}
          >
            Idle
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'rented' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200'}`}
            onClick={() => setFilter('rented')}
          >
            Rented
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'overdue' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200'}`}
            onClick={() => setFilter('overdue')}
          >
            Overdue
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'maintenance' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200'}`}
            onClick={() => setFilter('maintenance')}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="cat-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{item.code}</h3>
                <p className="text-gray-600">{item.type}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Current Site</p>
              <p className="font-medium">{item.site || 'Unassigned'}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-900"
                onClick={() => setShowQR(item)}
              >
                Show QR Code
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-center">QR Code for {showQR.code}</h3>
            <div className="flex justify-center mb-4">
              <QRCode value={showQR.code} size={200} />
            </div>
            <p className="text-center mb-4">Scan to view equipment details</p>
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
    </div>
  );
}
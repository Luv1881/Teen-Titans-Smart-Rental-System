'use client';

import { useState, useEffect } from 'react';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    // In a real app, this would come from an API
    const mockRentals = [
      {
        id: 1,
        equipmentCode: 'EXC1001',
        equipmentType: 'Excavator',
        site: 'Site S001',
        company: 'ABC Construction',
        operator: 'John Doe',
        checkoutDate: '2023-06-15',
        expectedReturn: '2023-06-25',
        status: 'active'
      },
      {
        id: 2,
        equipmentCode: 'CRN2002',
        equipmentType: 'Crane',
        site: 'Site S003',
        company: 'XYZ Builders',
        operator: 'Jane Smith',
        checkoutDate: '2023-06-10',
        expectedReturn: '2023-06-20',
        status: 'overdue'
      },
      {
        id: 3,
        equipmentCode: 'BLD3003',
        equipmentType: 'Bulldozer',
        site: 'Site S002',
        company: 'DEF Contractors',
        operator: 'Mike Johnson',
        checkoutDate: '2023-06-01',
        expectedReturn: '2023-06-15',
        status: 'returned'
      }
    ];
    setRentals(mockRentals);
  }, []);

  const filteredRentals = rentals.filter(rental => filter === 'all' || rental.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Rentals</h1>
        <button className="cat-button">New Rental</button>
      </div>

      {/* Filters */}
      <div className="cat-card mb-8">
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All Rentals
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'overdue' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200'}`}
            onClick={() => setFilter('overdue')}
          >
            Overdue
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'returned' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200'}`}
            onClick={() => setFilter('returned')}
          >
            Returned
          </button>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="cat-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRentals.map((rental) => (
                <tr key={rental.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rental.equipmentCode}</div>
                    <div className="text-sm text-gray-500">{rental.equipmentType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rental.site}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rental.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rental.operator}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Checkout: {rental.checkoutDate}</div>
                    <div>Return: {rental.expectedReturn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(rental.status)}`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    {rental.status === 'active' && (
                      <button className="text-green-600 hover:text-green-900">Check In</button>
                    )}
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
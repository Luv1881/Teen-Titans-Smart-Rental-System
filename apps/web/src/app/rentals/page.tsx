'use client';

import { useState, useEffect } from 'react';
import RentalForm from '@/components/rental-form';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [filter, setFilter] = useState('active');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);

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

  const filteredRentals = filter === 'all' 
    ? rentals 
    : rentals.filter(rental => filter === 'all' || rental.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRental = async (data) => {
    // In a real app, this would make an API call
    console.log('Creating rental:', data);
    // Simulate API call
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleUpdateRental = async (data) => {
    // In a real app, this would make an API call
    console.log('Updating rental:', data);
    // Simulate API call
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const openEditForm = (rental) => {
    setEditingRental(rental);
    setIsFormOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-cat-dark">Rentals</h1>
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
              setEditingRental(null);
              setIsFormOpen(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Rental
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
            All Rentals
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200 text-cat-dark'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'overdue' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200 text-cat-dark'}`}
            onClick={() => setFilter('overdue')}
          >
            Overdue
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === 'returned' ? 'bg-cat-yellow text-cat-dark' : 'bg-gray-200 text-cat-dark'}`}
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
                <tr key={rental.id} className="hover:bg-gray-50">
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
                      {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => openEditForm(rental)}
                    >
                      Edit
                    </button>
                    {rental.status === 'active' && (
                      <button className="text-green-600 hover:text-green-900">
                        Check In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RentalForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRental(null);
        }}
        onSubmit={editingRental ? handleUpdateRental : handleCreateRental}
        initialData={editingRental}
      />
    </div>
  );
}
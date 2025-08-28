'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Sites() {
  const [sites, setSites] = useState([
    {
      id: 1,
      code: 'S001',
      name: 'Bengaluru - Devanahalli',
      location: 'Devanahalli, Bengaluru',
      latitude: 13.2433,
      longitude: 77.7123,
      status: 'operational'
    },
    {
      id: 2,
      code: 'S002',
      name: 'Chennai - Sriperumbudur',
      location: 'Sriperumbudur, Chennai',
      latitude: 12.8071,
      longitude: 80.0494,
      status: 'operational'
    },
    {
      id: 3,
      code: 'S003',
      name: 'Hyderabad - Shamirpet',
      location: 'Shamirpet, Hyderabad',
      latitude: 17.5117,
      longitude: 78.4828,
      status: 'maintenance'
    }
  ]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Center of India for the map
  const mapCenter = [20.5937, 78.9629];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sites</h1>
        <button className="cat-button">Add Site</button>
      </div>

      {/* Map View */}
      <div className="cat-card mb-8">
        <h2 className="text-xl font-bold mb-4">Site Locations</h2>
        <div className="h-96 rounded-lg overflow-hidden">
          <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {sites.map((site) => (
              <Marker key={site.id} position={[site.latitude, site.longitude]}>
                <Popup>
                  <div>
                    <h3 className="font-bold">{site.name}</h3>
                    <p className="text-sm">{site.location}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${getStatusClass(site.status)}`}>
                      {site.status}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Sites List */}
      <div className="cat-card">
        <h2 className="text-xl font-bold mb-4">Site Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sites.map((site) => (
                <tr key={site.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{site.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{site.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{site.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(site.status)}`}>
                      {site.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900">View</button>
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
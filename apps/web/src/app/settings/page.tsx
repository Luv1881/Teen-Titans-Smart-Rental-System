'use client';

import { useState } from 'react';

export default function Settings() {
  const [role, setRole] = useState('admin');
  const [offlineWeather, setOfflineWeather] = useState(false);

  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'dispatcher', name: 'Dispatcher' },
    { id: 'site_manager', name: 'Site Manager' },
    { id: 'viewer', name: 'Viewer' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-cat-dark">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role Switcher */}
        <div className="cat-card">
          <h2 className="text-xl font-bold mb-4 text-cat-dark">User Role</h2>
          <div className="space-y-4">
            {roles.map((roleOption) => (
              <div key={roleOption.id} className="flex items-center">
                <input
                  id={roleOption.id}
                  name="role"
                  type="radio"
                  checked={role === roleOption.id}
                  onChange={() => setRole(roleOption.id)}
                  className="h-4 w-4 text-cat-yellow border-gray-300 focus:ring-cat-yellow"
                />
                <label htmlFor={roleOption.id} className="ml-3 block text-sm font-medium text-gray-700">
                  {roleOption.name}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">Current Permissions</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-700">
              {role === 'admin' && (
                <>
                  <li>Full system access</li>
                  <li>Create/edit/delete all entities</li>
                  <li>Manage user roles</li>
                </>
              )}
              {role === 'dispatcher' && (
                <>
                  <li>Manage equipment rentals</li>
                  <li>View equipment status</li>
                  <li>Update rental records</li>
                </>
              )}
              {role === 'site_manager' && (
                <>
                  <li>Manage site-specific equipment</li>
                  <li>View site reports</li>
                  <li>Request maintenance</li>
                </>
              )}
              {role === 'viewer' && (
                <>
                  <li>View equipment status</li>
                  <li>View rental information</li>
                  <li>View reports and dashboards</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        {/* System Settings */}
        <div className="cat-card">
          <h2 className="text-xl font-bold mb-4 text-cat-dark">System Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Offline Weather Mode</h3>
                <p className="text-sm text-gray-500">Use cached weather data when API is unavailable</p>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cat-yellow focus:ring-offset-2 ${
                  offlineWeather ? 'bg-cat-yellow' : 'bg-gray-200'
                }`}
                role="switch"
                onClick={() => setOfflineWeather(!offlineWeather)}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    offlineWeather ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Data Management</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  Export Equipment Data
                </button>
                <button className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  Export Rental History
                </button>
                <button className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  System Health Check
                </button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">About</h3>
              <div className="text-sm text-gray-500">
                <p>CAT Smart Rental Tracker v1.0.0</p>
                <p className="mt-1">© 2023 Caterpillar Inc. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
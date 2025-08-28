'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  TrendingUp, 
  Bell, 
  MapPin, 
  Settings, 
  Menu,
  Plus,
  FileText,
  HardHat,
  Calendar
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Rentals', href: '/rentals', icon: FileText },
  { name: 'Equipment', href: '/equipment', icon: Package },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Forecasting', href: '/forecasting', icon: TrendingUp },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Sites', href: '/sites', icon: MapPin },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const newItems = [
  { name: 'New Rental', href: '/rentals/new' },
  { name: 'Add Equipment', href: '/equipment/new' },
  { name: 'Schedule Maintenance', href: '/maintenance/new' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-cat-dark border-b-2 border-cat-yellow backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-cat-yellow w-8 h-8 rounded-full flex items-center justify-center mr-3">
              <span className="text-cat-dark font-bold text-lg">C</span>
            </div>
            <span className="text-white font-bold text-lg">CAT Smart Rental</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-cat-yellow text-cat-dark'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Role Pill */}
            <div className="hidden md:flex items-center bg-gray-800 px-3 py-1 rounded-full">
              <span className="text-white text-sm">Admin</span>
            </div>

            {/* New Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                className="flex items-center bg-cat-yellow text-cat-dark px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">New</span>
              </button>

              {isNewMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                  {newItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsNewMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-cat-dark border-t border-gray-800">
          <div className="container mx-auto px-4 py-3">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-cat-yellow text-cat-dark'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-3">Create New</div>
              <div className="space-y-1">
                {newItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CAT Smart Rental Tracker',
  description: 'Equipment Management System for Caterpillar Dealerships',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          <header className="cat-header">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">CAT Smart Rental</h1>
              <nav>
                <ul className="flex space-x-6">
                  <li><a href="/" className="hover:text-cat-yellow">Dashboard</a></li>
                  <li><a href="/rentals" className="hover:text-cat-yellow">Rentals</a></li>
                  <li><a href="/equipment" className="hover:text-cat-yellow">Equipment</a></li>
                  <li><a href="/maintenance" className="hover:text-cat-yellow">Maintenance</a></li>
                  <li><a href="/forecasting" className="hover:text-cat-yellow">Forecasting</a></li>
                  <li><a href="/alerts" className="hover:text-cat-yellow">Alerts</a></li>
                  <li><a href="/sites" className="hover:text-cat-yellow">Sites</a></li>
                  <li><a href="/settings" className="hover:text-cat-yellow">Settings</a></li>
                </ul>
              </nav>
            </div>
          </header>
          <main className="container mx-auto py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
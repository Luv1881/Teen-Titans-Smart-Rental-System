import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/header';
import Toast from '@/components/toast';
import { ToastProvider } from '@/context/toast-context';

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
        <ToastProvider>
          <div className="min-h-screen bg-gray-100 text-cat-dark">
            <Header />
            <main className="container mx-auto py-8 px-4">
              {children}
            </main>
            <Toast />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
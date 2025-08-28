'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/modal';
import { useToastContext } from '@/context/toast-context';

const rentalSchema = z.object({
  equipment_id: z.number().positive("Equipment is required"),
  site_id: z.number().positive("Site is required"),
  company_id: z.number().positive("Company is required"),
  operator_id: z.number().positive("Operator is required"),
  expected_return_date: z.string().min(1, "Expected return date is required"),
});

type RentalFormData = z.infer<typeof rentalSchema>;

export default function RentalForm({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData = null
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: RentalFormData) => void;
  initialData?: any;
}) {
  const { success, error } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: initialData || {
      equipment_id: 0,
      site_id: 0,
      company_id: 0,
      operator_id: 0,
      expected_return_date: '',
    }
  });

  const handleFormSubmit = async (data: RentalFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      success(initialData ? 'Rental updated successfully!' : 'Rental created successfully!');
      reset();
      onClose();
    } catch (err) {
      error('Failed to save rental. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Rental" : "New Rental"}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="equipment_id" className="block text-sm font-medium text-gray-700">
            Equipment
          </label>
          <select
            id="equipment_id"
            {...register('equipment_id', { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          >
            <option value="">Select Equipment</option>
            <option value="1">EXC1001 - Excavator</option>
            <option value="2">CRN2002 - Crane</option>
            <option value="3">BLD3003 - Bulldozer</option>
          </select>
          {errors.equipment_id && (
            <p className="mt-1 text-sm text-red-600">{errors.equipment_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="site_id" className="block text-sm font-medium text-gray-700">
            Site
          </label>
          <select
            id="site_id"
            {...register('site_id', { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          >
            <option value="">Select Site</option>
            <option value="1">S001 - Bengaluru</option>
            <option value="2">S002 - Chennai</option>
            <option value="3">S003 - Hyderabad</option>
          </select>
          {errors.site_id && (
            <p className="mt-1 text-sm text-red-600">{errors.site_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <select
            id="company_id"
            {...register('company_id', { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          >
            <option value="">Select Company</option>
            <option value="1">ABC Construction</option>
            <option value="2">XYZ Builders</option>
            <option value="3">DEF Contractors</option>
          </select>
          {errors.company_id && (
            <p className="mt-1 text-sm text-red-600">{errors.company_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="operator_id" className="block text-sm font-medium text-gray-700">
            Operator
          </label>
          <select
            id="operator_id"
            {...register('operator_id', { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          >
            <option value="">Select Operator</option>
            <option value="1">John Doe</option>
            <option value="2">Jane Smith</option>
            <option value="3">Mike Johnson</option>
          </select>
          {errors.operator_id && (
            <p className="mt-1 text-sm text-red-600">{errors.operator_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="expected_return_date" className="block text-sm font-medium text-gray-700">
            Expected Return Date
          </label>
          <input
            type="date"
            id="expected_return_date"
            {...register('expected_return_date')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          />
          {errors.expected_return_date && (
            <p className="mt-1 text-sm text-red-600">{errors.expected_return_date.message}</p>
          )}
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cat-yellow text-base font-medium text-cat-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cat-yellow sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Rental' : 'Create Rental'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cat-yellow sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/modal';
import { useToastContext } from '@/context/toast-context';

const maintenanceSchema = z.object({
  equipment_id: z.number().positive("Equipment is required"),
  service_date: z.string().min(1, "Service date is required"),
  service_type: z.string().min(1, "Service type is required"),
  issue_reported: z.string().optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

export default function MaintenanceForm({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData = null
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: MaintenanceFormData) => void;
  initialData?: any;
}) {
  const { success, error } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: initialData || {
      equipment_id: 0,
      service_date: '',
      service_type: '',
      issue_reported: '',
    }
  });

  const handleFormSubmit = async (data: MaintenanceFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      success(initialData ? 'Maintenance updated successfully!' : 'Maintenance scheduled successfully!');
      reset();
      onClose();
    } catch (err) {
      error('Failed to save maintenance. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Maintenance" : "Schedule Maintenance"}>
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
          <label htmlFor="service_date" className="block text-sm font-medium text-gray-700">
            Service Date
          </label>
          <input
            type="date"
            id="service_date"
            {...register('service_date')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          />
          {errors.service_date && (
            <p className="mt-1 text-sm text-red-600">{errors.service_date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">
            Service Type
          </label>
          <select
            id="service_type"
            {...register('service_type')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          >
            <option value="">Select Service Type</option>
            <option value="Preventive">Preventive</option>
            <option value="Breakdown">Breakdown</option>
            <option value="Predictive">Predictive</option>
          </select>
          {errors.service_type && (
            <p className="mt-1 text-sm text-red-600">{errors.service_type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="issue_reported" className="block text-sm font-medium text-gray-700">
            Issue Reported (Optional)
          </label>
          <textarea
            id="issue_reported"
            {...register('issue_reported')}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          />
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cat-yellow text-base font-medium text-cat-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cat-yellow sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Maintenance' : 'Schedule Maintenance'}
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
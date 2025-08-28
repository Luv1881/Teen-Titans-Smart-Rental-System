'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/modal';
import { useToastContext } from '@/context/toast-context';

const equipmentSchema = z.object({
  equipment_code: z.string().min(1, "Equipment code is required"),
  type: z.string().min(1, "Type is required"),
  site_id: z.number().optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

export default function EquipmentForm({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData = null
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: EquipmentFormData) => void;
  initialData?: any;
}) {
  const { success, error } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: initialData || {
      equipment_code: '',
      type: '',
      site_id: undefined,
    }
  });

  const handleFormSubmit = async (data: EquipmentFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      success(initialData ? 'Equipment updated successfully!' : 'Equipment added successfully!');
      reset();
      onClose();
    } catch (err) {
      error('Failed to save equipment. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Equipment" : "Add Equipment"}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="equipment_code" className="block text-sm font-medium text-gray-700">
            Equipment Code
          </label>
          <input
            type="text"
            id="equipment_code"
            {...register('equipment_code')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          />
          {errors.equipment_code && (
            <p className="mt-1 text-sm text-red-600">{errors.equipment_code.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            {...register('type')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cat-yellow focus:border-cat-yellow sm:text-sm"
          >
            <option value="">Select Type</option>
            <option value="Excavator">Excavator</option>
            <option value="Crane">Crane</option>
            <option value="Bulldozer">Bulldozer</option>
            <option value="Loader">Loader</option>
            <option value="Grader">Grader</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="site_id" className="block text-sm font-medium text-gray-700">
            Site (Optional)
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
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cat-yellow text-base font-medium text-cat-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cat-yellow sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Equipment' : 'Add Equipment'}
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
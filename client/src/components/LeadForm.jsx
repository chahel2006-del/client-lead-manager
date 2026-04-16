import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Sparkles, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_URL;

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  status: 'new',
  priority: 'medium',
  nextFollowUpDate: ''
};

const InputWrapper = ({ label, children, required }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

function LeadForm({ onLeadAdded }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Required Fields Missing', {
        description: 'Please provide both Name and Email.'
      });
      return;
    }

    setIsLoading(true);
    console.log(`[API] Creating lead at: ${BASE_URL}/api/leads`);
    
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        status: formData.status || 'new',
        priority: formData.priority || 'medium',
        nextFollowUpDate: formData.nextFollowUpDate || null,
        source: 'Form' // Keeping internal default
      };

      await axios.post(`${BASE_URL}/api/leads`, payload);
      
      toast.success('Lead Created', {
        description: `${formData.name} added to pipeline.`
      });
      
      setFormData(INITIAL_FORM_STATE);
      
      if (onLeadAdded) {
        onLeadAdded();
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to create lead');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Create Lead</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputWrapper label="Name" required>
          <input 
            type="text" 
            name="name" 
            placeholder="e.g. Rahul Sharma" 
            value={formData.name} 
            onChange={handleChange} 
            className={inputClasses} 
            required 
          />
        </InputWrapper>

        <InputWrapper label="Email" required>
          <input 
            type="email" 
            name="email" 
            placeholder="e.g. rahul@gmail.com" 
            value={formData.email} 
            onChange={handleChange} 
            className={inputClasses} 
            required 
          />
        </InputWrapper>

        <InputWrapper label="Priority">
          <select 
            name="priority" 
            value={formData.priority} 
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </InputWrapper>

        <InputWrapper label="Status">
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="new">On Track</option>
            <option value="due_soon">Due Soon</option>
            <option value="overdue">Overdue</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </InputWrapper>

        <InputWrapper label="Action Limit">
          <input 
            type="date" 
            name="nextFollowUpDate" 
            value={formData.nextFollowUpDate} 
            onChange={handleChange} 
            className={inputClasses}
          />
        </InputWrapper>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>Create Lead</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LeadForm;

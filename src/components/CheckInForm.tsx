import React, { useState } from 'react';
import { ArrowLeft, User, Users, MessageCircle, Send } from 'lucide-react';
import { supabase, visitorAPI, employeeAPI } from '../lib/supabase';
import type { Employee } from '../lib/supabase';

interface CheckInFormProps {
  onBack: () => void;
  photoUrl?: string;
  onSuccess: () => void;
}

export const CheckInForm: React.FC<CheckInFormProps> = ({ onBack, photoUrl, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    person_to_meet: '',
    person_to_meet_id: '',
    reason_to_visit: '',
    custom_reason: ''
  });

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const reasons = [
    'Meeting', 'Interview', 'Delivery', 'Maintenance', 'Sales Visit', 'Others'
  ];

  const handleEmployeeChange = async (value: string) => {
    setFormData(prev => ({ ...prev, person_to_meet: value, person_to_meet_id: '' }));

    if (!value) {
      setFilteredEmployees([]);
      setShowEmployeeDropdown(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, role, department')
        .ilike('name', `%${value}%`)
        .limit(8);

      if (error) {
        console.error('Employee search failed:', error);
        setFilteredEmployees([]);
        setShowEmployeeDropdown(false);
        return;
      }

      setFilteredEmployees(data || []);
      setShowEmployeeDropdown((data || []).length > 0);
    } catch (error) {
      console.error('Error searching employees:', error);
      setFilteredEmployees([]);
      setShowEmployeeDropdown(false);
    }
  };

  const selectEmployee = (employee: Employee) => {
    setFormData(prev => ({
      ...prev,
      person_to_meet: employee.name,
      person_to_meet_id: employee.id
    }));
    setShowEmployeeDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reason = formData.reason_to_visit === 'Others'
        ? formData.custom_reason
        : formData.reason_to_visit;

      await visitorAPI.checkInVisitor({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        person_to_meet_id: formData.person_to_meet_id,
        person_to_meet: formData.person_to_meet,
        reason_to_visit: reason,
        photo_url: photoUrl
      });

      console.log('Check-in successful, calling onSuccess');
      onSuccess();
    } catch (error) {
      console.error('Error checking in visitor:', error);
      alert('Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Personal Info', icon: User, fields: ['full_name', 'phone_number'] },
    { title: 'Meeting Details', icon: Users, fields: ['person_to_meet'] },
    { title: 'Visit Reason', icon: MessageCircle, fields: ['reason_to_visit'] }
  ];

  const currentFields = steps[currentStep]?.fields || [];
  const isCurrentStepValid = currentFields.every(field => {
    if (field === 'reason_to_visit' && formData.reason_to_visit === 'Others') {
      return formData.custom_reason.trim() !== '';
    }
    if (field === 'person_to_meet') {
      return formData.person_to_meet.trim() !== '';
    }
    return (formData as any)[field]?.trim?.() !== '';
  });

  const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(p => p + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(p => p - 1);
  const StepIcon = steps[currentStep]?.icon || User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-2xl w-full relative z-10">
        <button onClick={onBack} className="flex items-center text-blue-300 hover:text-white transition-colors duration-200 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        {/* Progress bar */}
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div key={index} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-slate-700'
              }`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${index < currentStep ? 'bg-blue-600' : 'bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Nudge */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <StepIcon className="w-5 h-5 text-blue-400" />
            <p className="text-blue-300 font-medium">
              {currentStep === 0 && "Let's start with your basic information"}
              {currentStep === 1 && "Who are you here to meet today?"}
              {currentStep === 2 && "What's the purpose of your visit?"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 0: Personal Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={e => setFormData(p => ({ ...p, phone_number: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          )}

          {/* Step 1: Person to Meet */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-blue-200 mb-2">Person to Meet *</label>
                <input
                  type="text"
                  required
                  value={formData.person_to_meet}
                  onChange={e => handleEmployeeChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Start typing employee name..."
                />

                {showEmployeeDropdown && filteredEmployees.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-800/90 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {filteredEmployees.map(emp => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => selectEmployee(emp)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-700/30 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-white font-medium">{emp.name}</div>
                          <div className="text-blue-300 text-sm">{emp.role} • {emp.department}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Reason */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Reason for Visit *</label>
                <div className="grid grid-cols-2 gap-3">
                  {reasons.map(reason => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, reason_to_visit: reason }))}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.reason_to_visit === reason
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800/50 backdrop-blur-sm border-blue-500/30 text-blue-200 hover:bg-blue-700/30'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {formData.reason_to_visit === 'Others' && (
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Please specify *</label>
                  <input
                    type="text"
                    required
                    value={formData.custom_reason}
                    onChange={e => setFormData(p => ({ ...p, custom_reason: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter custom reason"
                  />
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-700/50 backdrop-blur-sm text-white hover:bg-slate-600/50'
              }`}
            >
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                disabled={!isCurrentStepValid || loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isCurrentStepValid && !loading
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Checking In...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Check In
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isCurrentStepValid}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isCurrentStepValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
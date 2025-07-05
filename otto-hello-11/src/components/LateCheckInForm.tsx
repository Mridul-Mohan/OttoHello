import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Users, MessageCircle, Send, Clock, Zap } from 'lucide-react';
import { employeeAPI, LATE_ARRIVAL_REASONS } from '../lib/supabase';
import type { Employee } from '../lib/supabase';

interface LateCheckInFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const LateCheckInForm: React.FC<LateCheckInFormProps> = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_name: '',
    reporting_manager: '',
    reason_for_lateness: ''
  });
  const [managers, setManagers] = useState<Employee[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<Employee[]>([]);
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadManagers();
  }, []);

  useEffect(() => {
    if (formData.reporting_manager) {
      const filtered = managers.filter(manager =>
        manager.name.toLowerCase().includes(formData.reporting_manager.toLowerCase())
      );
      setFilteredManagers(filtered);
      setShowManagerDropdown(filtered.length > 0);
    } else {
      setFilteredManagers([]);
      setShowManagerDropdown(false);
    }
  }, [formData.reporting_manager, managers]);

  const loadManagers = async () => {
    try {
      const data = await employeeAPI.getManagers();
      setManagers(data);
    } catch (error) {
      console.error('Error loading managers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await employeeAPI.recordLateArrival(formData);
      onSuccess();
    } catch (error) {
      console.error('Error recording late arrival:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectManager = (manager: Employee) => {
    setFormData(prev => ({ ...prev, reporting_manager: manager.name }));
    setShowManagerDropdown(false);
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-3xl w-full relative z-10">
        <button
          onClick={onBack}
          className="flex items-center text-blue-300 hover:text-white transition-all duration-300 mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back</span>
        </button>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-orange-500/30 relative">
            <Clock className="w-10 h-10 text-orange-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-ping opacity-75"></div>
          </div>
          
          <div className="inline-flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-orange-400 animate-pulse" />
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Late Check-In
            </h1>
            <Zap className="w-6 h-6 text-red-400 animate-pulse delay-500" />
          </div>
          
          <p className="text-xl text-blue-200 font-light">
            Record your late arrival quickly
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <p className="text-orange-300 font-medium">
              Your reporting manager and HR will be automatically notified
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Employee Name *
              </label>
              <input
                type="text"
                required
                value={formData.employee_name}
                onChange={(e) => setFormData(prev => ({ ...prev, employee_name: e.target.value }))}
                className="w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Reporting Manager *
              </label>
              <input
                type="text"
                required
                value={formData.reporting_manager}
                onChange={(e) => setFormData(prev => ({ ...prev, reporting_manager: e.target.value }))}
                className="w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                placeholder="Start typing manager name..."
              />
              
              {showManagerDropdown && filteredManagers.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-slate-800/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                  {filteredManagers.map((manager) => (
                    <button
                      key={manager.id}
                      type="button"
                      onClick={() => selectManager(manager)}
                      className="w-full px-6 py-4 text-left hover:bg-blue-700/30 flex items-center justify-between transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div>
                        <div className="text-white font-medium">{manager.name}</div>
                        <div className="text-blue-300 text-sm">{manager.role} • {manager.department}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Reason for Being Late *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LATE_ARRIVAL_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, reason_for_lateness: reason }))}
                    className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                      formData.reason_for_lateness === reason
                        ? 'bg-gradient-to-r from-orange-600/90 to-red-600/90 border-orange-500/50 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-slate-800/50 backdrop-blur-sm border-blue-500/30 text-blue-200 hover:bg-blue-700/30 hover:border-blue-400/50'
                    }`}
                  >
                    <span className="font-medium">{reason}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg ${
              isFormValid && !loading
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white hover:shadow-orange-500/25 hover:scale-105'
                : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Recording Late Arrival...
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                Record Late Check-In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Users, TrendingUp, UserMinus, Clock } from 'lucide-react';
import { visitorAPI } from '../lib/supabase';
import type { Visitor } from '../lib/supabase';

interface CheckOutDashboardProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CheckOutDashboard: React.FC<CheckOutDashboardProps> = ({ onBack, onSuccess }) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ currentlyCheckedIn: 0, totalToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = visitors.filter(visitor =>
        visitor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.person_to_meet.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVisitors(filtered);
    } else {
      setFilteredVisitors(visitors);
    }
  }, [searchTerm, visitors]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [visitorsData, statsData] = await Promise.all([
        visitorAPI.getCheckedInVisitors(),
        visitorAPI.getVisitorStats()
      ]);
      
      setVisitors(visitorsData);
      setFilteredVisitors(visitorsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (visitor: Visitor) => {
    try {
      await visitorAPI.checkOutVisitor(visitor.id);
      await loadData(); // Refresh data
      onSuccess();
    } catch (error) {
      console.error('Error checking out visitor:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center text-blue-300 hover:text-white transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Check Out Dashboard</h1>
          <p className="text-blue-200">Manage visitor departures</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Currently Checked In</p>
                <p className="text-3xl font-bold text-white">{stats.currentlyCheckedIn}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Today</p>
                <p className="text-3xl font-bold text-white">{stats.totalToday}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="text"
            placeholder="Search visitors by name or person they're meeting..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Visitors List */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-500/30">
            <h2 className="text-xl font-semibold text-white">Checked In Visitors</h2>
          </div>
          
          {filteredVisitors.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
              <p className="text-blue-300 text-lg">
                {searchTerm ? 'No visitors found matching your search' : 'No visitors currently checked in'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-blue-500/20">
              {filteredVisitors.map((visitor) => (
                <div key={visitor.id} className="px-6 py-4 hover:bg-blue-700/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {visitor.photo_url && (
                        <img
                          src={visitor.photo_url}
                          alt={visitor.full_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-white">{visitor.full_name}</h3>
                        <p className="text-blue-300">Meeting: {visitor.person_to_meet}</p>
                        <p className="text-blue-400 text-sm">
                          Reason: {visitor.reason_to_visit} • Phone: {visitor.phone_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-blue-300 text-sm flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Checked in at {formatTime(visitor.checked_in_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCheckOut(visitor)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                      >
                        <UserMinus className="w-4 h-4" />
                        Check Out
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
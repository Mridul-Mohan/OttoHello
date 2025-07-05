import React from 'react';
import { ArrowLeft, UserPlus, UserMinus, Zap } from 'lucide-react';

interface VisitorFlowProps {
  onBack: () => void;
  onSelectAction: (action: 'check-in' | 'check-out') => void;
}

export const VisitorFlow: React.FC<VisitorFlowProps> = ({ onBack, onSelectAction }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-5xl w-full relative z-10">
        <button
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-white transition-all duration-300 mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Welcome</span>
        </button>

        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
              Visitor Portal
            </h1>
            <Zap className="w-8 h-8 text-purple-400 animate-pulse delay-500" />
          </div>
          <p className="text-2xl text-slate-300 font-light">
            Choose your action to continue
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <button
            onClick={() => onSelectAction('check-in')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600/90 to-green-700/90 backdrop-blur-sm border border-green-500/30 p-12 text-white transition-all duration-500 hover:from-green-500/90 hover:to-green-600/90 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
          >
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 left-4 w-2 h-2 bg-green-300 rounded-full animate-bounce opacity-60"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-green-200 rounded-full animate-bounce delay-300 opacity-80"></div>
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-700 opacity-70"></div>
            </div>

            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400/50 to-emerald-400/50 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm mb-8 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <UserPlus className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-wide">Check In</h2>
              <p className="text-green-100 text-xl leading-relaxed">
                Register your arrival and get started
              </p>
              
              {/* Status indicator */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-sm font-medium">Ready</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('check-out')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600/90 to-orange-700/90 backdrop-blur-sm border border-orange-500/30 p-12 text-white transition-all duration-500 hover:from-orange-500/90 hover:to-orange-600/90 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
          >
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 right-4 w-2 h-2 bg-orange-300 rounded-full animate-bounce opacity-60"></div>
              <div className="absolute top-8 left-8 w-1 h-1 bg-orange-200 rounded-full animate-bounce delay-300 opacity-80"></div>
              <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-700 opacity-70"></div>
            </div>

            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-400/50 to-red-400/50 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm mb-8 mx-auto group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <UserMinus className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-wide">Check Out</h2>
              <p className="text-orange-100 text-xl leading-relaxed">
                Complete your visit and departure
              </p>
              
              {/* Status indicator */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-200 text-sm font-medium">Active</span>
              </div>
            </div>
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-500"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
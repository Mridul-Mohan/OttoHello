import React from 'react';
import { Users, UserCheck, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectUserType: (type: 'visitor' | 'growthpreneur') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectUserType }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/20 mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
            <Users className="w-14 h-14 text-blue-400 relative z-10" />
            <Sparkles className="w-6 h-6 text-blue-300 absolute -top-2 -right-2 animate-bounce" />
          </div>
          
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-6 tracking-tight">
            Otto<span className="text-blue-400">Hello</span>
          </h1>
          
          <div className="relative">
            <p className="text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Welcome to GrowthJockey's intelligent visitor management ecosystem
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <button
            onClick={() => onSelectUserType('visitor')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/90 to-blue-700/90 backdrop-blur-sm border border-blue-500/30 p-10 text-white transition-all duration-500 hover:from-blue-500/90 hover:to-blue-600/90 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/50 to-purple-400/50 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-wide">Visitor</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Seamless check-in and check-out experience
              </p>
              
              {/* Subtle animation indicator */}
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-75"></div>
            </div>
          </button>

          <button
            onClick={() => onSelectUserType('growthpreneur')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/90 to-emerald-700/90 backdrop-blur-sm border border-emerald-500/30 p-10 text-white transition-all duration-500 hover:from-emerald-500/90 hover:to-emerald-600/90 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400/50 to-blue-400/50 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-wide">Growthpreneur</h2>
              <p className="text-emerald-100 text-lg leading-relaxed">
                Quick late arrival registration
              </p>
              
              {/* Subtle animation indicator */}
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-emerald-300 rounded-full animate-ping opacity-75"></div>
            </div>
          </button>
        </div>

        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-slate-400 text-sm font-medium">
              Powered by OttoHello • GrowthJockey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Users, UserCheck, Sparkles, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectUserType: (type: 'visitor' | 'growthpreneur') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectUserType }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Futuristic animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-fuchsia-500/15 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Futuristic grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Diagonal lines for futuristic effect */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(-45deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-violet-400 rounded-full animate-bounce delay-300 opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce delay-700 opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-1000 opacity-60"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-500 opacity-75"></div>
        <div className="absolute top-3/4 right-1/6 w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce delay-1200 opacity-65"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-500/30 backdrop-blur-sm border border-purple-400/30 mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border border-purple-300/20 animate-spin" style={{ animationDuration: '8s' }}></div>
            <Users className="w-16 h-16 text-purple-300 relative z-10" />
            <Sparkles className="w-6 h-6 text-purple-200 absolute -top-2 -right-2 animate-bounce" />
            <Zap className="w-5 h-5 text-violet-300 absolute -bottom-1 -left-1 animate-pulse" />
          </div>
          
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 mb-6 tracking-tight relative">
            Otto<span className="text-purple-300">Hello</span>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-violet-600/20 blur-xl opacity-50 animate-pulse"></div>
          </h1>
          
          <div className="relative">
            <p className="text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed font-light">
              Welcome to GrowthJockey's intelligent visitor management ecosystem
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 rounded-full opacity-80 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <button
            onClick={() => onSelectUserType('visitor')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/90 to-violet-700/90 backdrop-blur-sm border border-purple-400/40 p-12 text-white transition-all duration-500 hover:from-purple-500/90 hover:to-violet-600/90 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
          >
            {/* Futuristic animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/30 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            
            {/* Enhanced glowing border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/60 to-violet-400/60 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
            
            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-purple-300/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-purple-300/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-300/50 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-purple-300/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm mb-8 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-purple-300/30">
                <Users className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-wide">Visitor</h2>
              <p className="text-purple-100 text-lg leading-relaxed">
                Seamless check-in and check-out experience
              </p>
              
              {/* Enhanced animation indicator */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-75"></div>
                <div className="w-1 h-1 bg-violet-300 rounded-full animate-ping opacity-60 delay-300"></div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectUserType('growthpreneur')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/90 to-fuchsia-700/90 backdrop-blur-sm border border-violet-400/40 p-12 text-white transition-all duration-500 hover:from-violet-500/90 hover:to-fuchsia-600/90 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/30"
          >
            {/* Futuristic animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/0 via-violet-400/30 to-violet-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            
            {/* Enhanced glowing border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-400/60 to-fuchsia-400/60 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
            
            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-violet-300/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-violet-300/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-violet-300/50 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-violet-300/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm mb-8 mx-auto group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 border border-violet-300/30">
                <UserCheck className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-wide">Growthpreneur</h2>
              <p className="text-violet-100 text-lg leading-relaxed">
                Quick late arrival registration
              </p>
              
              {/* Enhanced animation indicator */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-300 rounded-full animate-ping opacity-75"></div>
                <div className="w-1 h-1 bg-fuchsia-300 rounded-full animate-ping opacity-60 delay-300"></div>
              </div>
            </div>
          </button>
        </div>

        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-purple-800/30 backdrop-blur-sm border border-purple-400/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-300"></div>
              <div className="w-1 h-1 bg-fuchsia-400 rounded-full animate-pulse delay-600"></div>
            </div>
            <div className="w-px h-6 bg-purple-400/50"></div>
            <p className="text-purple-200 text-sm font-medium">
              Powered by OttoHello • GrowthJockey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
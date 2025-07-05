import React, { useEffect } from 'react';
import { CheckCircle, Home, Sparkles, Heart } from 'lucide-react';

interface ThankYouScreenProps {
  type: 'visitor-checkin' | 'visitor-checkout' | 'late-checkin';
  onHome: () => void;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ type, onHome }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onHome();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onHome]);

  const getMessage = () => {
    switch (type) {
      case 'visitor-checkin':
        return {
          title: 'Welcome to GrowthJockey!',
          subtitle: 'Your check-in has been recorded successfully.',
          message: 'The person you are meeting has been notified of your arrival.',
          color: 'from-green-400 to-emerald-400',
          bgColor: 'from-green-500/10 to-emerald-500/10',
          borderColor: 'border-green-500/30'
        };
      case 'visitor-checkout':
        return {
          title: 'Thank You for Visiting!',
          subtitle: 'Your check-out has been recorded successfully.',
          message: 'We hope you had a great experience at GrowthJockey.',
          color: 'from-blue-400 to-purple-400',
          bgColor: 'from-blue-500/10 to-purple-500/10',
          borderColor: 'border-blue-500/30'
        };
      case 'late-checkin':
        return {
          title: 'Late Check-In Recorded',
          subtitle: 'Your arrival has been logged successfully.',
          message: 'Your reporting manager and HR have been notified.',
          color: 'from-orange-400 to-red-400',
          bgColor: 'from-orange-500/10 to-red-500/10',
          borderColor: 'border-orange-500/30'
        };
      default:
        return {
          title: 'Thank You!',
          subtitle: 'Your request has been processed.',
          message: 'Have a great day!',
          color: 'from-blue-400 to-purple-400',
          bgColor: 'from-blue-500/10 to-purple-500/10',
          borderColor: 'border-blue-500/30'
        };
    }
  };

  const { title, subtitle, message, color, bgColor, borderColor } = getMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-300 opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-700 opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-bounce delay-1000 opacity-60"></div>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="mb-12">
          <div className={`w-32 h-32 bg-gradient-to-br ${bgColor} rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border ${borderColor} relative`}>
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${bgColor} animate-pulse`}></div>
            <CheckCircle className="w-16 h-16 text-green-400 relative z-10" />
            <Sparkles className="w-6 h-6 text-green-300 absolute -top-2 -right-2 animate-bounce" />
            <Heart className="w-4 h-4 text-green-300 absolute -bottom-1 -left-1 animate-pulse" />
          </div>
          
          <h1 className={`text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${color} mb-6 tracking-tight`}>
            {title}
          </h1>
          
          <p className="text-2xl text-blue-200 mb-4 font-light">{subtitle}</p>
          <p className="text-xl text-blue-300 leading-relaxed">{message}</p>
        </div>

        <div className={`bg-gradient-to-r ${bgColor} backdrop-blur-sm border ${borderColor} rounded-2xl p-8 mb-12 relative overflow-hidden`}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <div className="relative z-10">
            <p className="text-blue-200 mb-6 text-lg">
              Redirecting to home screen in a few seconds...
            </p>
            
            {/* Countdown animation */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} animate-pulse`}
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                ))}
              </div>
            </div>
            
            <button
              onClick={onHome}
              className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-blue-500/25 hover:scale-105`}
            >
              <Home className="w-6 h-6" />
              Go to Home
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-slate-800/50 backdrop-blur-sm border border-blue-500/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-sm font-medium">System Active</span>
            </div>
            <div className="w-px h-4 bg-blue-400/50"></div>
            <p className="text-blue-300 text-sm font-medium">
              Powered by OttoHello • GrowthJockey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
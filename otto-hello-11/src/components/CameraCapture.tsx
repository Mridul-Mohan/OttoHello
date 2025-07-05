import React, { useRef, useState, useEffect } from 'react';
import { Camera, RotateCcw, Check, Sparkles, Focus } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCapture: (photoDataUrl: string) => void;
  onSkip: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture, onSkip }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true);
        };
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera access error:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(dataUrl);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm border border-red-500/30">
            <Camera className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Camera Access Required</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={onSkip}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-blue-500/25"
          >
            Continue without photo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-3xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Capture Your Photo
            </h2>
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse delay-500" />
          </div>
          <p className="text-xl text-slate-300 font-light">
            Position yourself in the frame and smile!
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 mb-12 shadow-2xl">
          {!capturedPhoto ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
              />
              
              {/* Camera overlay effects */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-400 rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-400 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-400 rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-400 rounded-br-lg"></div>
                
                {/* Center focus circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-48 h-48 border-2 border-blue-400/60 rounded-full animate-pulse">
                    <div className="w-full h-full border-2 border-blue-300/40 rounded-full animate-ping"></div>
                  </div>
                </div>

                {/* Status indicator */}
                {isReady && (
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-sm font-medium">Camera Ready</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={capturedPhoto}
                alt="Captured"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2">
                <span className="text-green-300 text-sm font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Photo Captured
                </span>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex justify-center gap-6">
          {!capturedPhoto ? (
            <>
              <button
                onClick={capturePhoto}
                disabled={!isReady}
                className={`flex items-center gap-3 px-10 py-5 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg ${
                  isReady
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white hover:shadow-blue-500/25 hover:scale-105'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Camera className="w-6 h-6" />
                Capture Photo
              </button>
              <button
                onClick={onSkip}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:scale-105"
              >
                <Focus className="w-6 h-6" />
                Skip Photo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:scale-105"
              >
                <RotateCcw className="w-6 h-6" />
                Retake
              </button>
              <button
                onClick={confirmPhoto}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-green-500/25 hover:scale-105"
              >
                <Check className="w-6 h-6" />
                Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
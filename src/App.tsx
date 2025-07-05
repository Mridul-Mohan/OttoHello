@@ .. @@
import React, { useState } from 'react';
+import { useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { VisitorFlow } from './components/VisitorFlow';
import { CameraCapture } from './components/CameraCapture';
import { CheckInForm } from './components/CheckInForm';
import { CheckOutDashboard } from './components/CheckOutDashboard';
import { LateCheckInForm } from './components/LateCheckInForm';
import { ThankYouScreen } from './components/ThankYouScreen';
+import { employeeAPI } from './lib/supabase';

type AppState = 
  | { screen: 'welcome' }
  | { screen: 'visitor-flow' }
  | { screen: 'camera-capture' }
  | { screen: 'check-in-form'; photoUrl?: string }
  | { screen: 'check-out-dashboard' }
  | { screen: 'late-check-in' }
  | { screen: 'thank-you'; type: 'visitor-checkin' | 'visitor-checkout' | 'late-checkin' };

function App() {
  const [appState, setAppState] = useState<AppState>({ screen: 'welcome' });

+  // Automatically sync Slack employees when app loads
+  useEffect(() => {
+    const syncSlackEmployees = async () => {
+      try {
+        console.log('Auto-syncing Slack employees...');
+        await employeeAPI.syncSlackEmployees();
+        console.log('Slack employees synced successfully');
+      } catch (error) {
+        console.error('Failed to auto-sync Slack employees:', error);
+        // Don't show error to user, just log it
+      }
+    };
+
+    syncSlackEmployees();
+  }, []);
+
  const handleUserTypeSelect = (type: 'visitor' | 'growthpreneur') => {
    if (type === 'visitor') {
      setAppState({ screen: 'visitor-flow' });
    } else {
      setAppState({ screen: 'late-check-in' });
    }
  };

  const handleVisitorAction = (action: 'check-in' | 'check-out') => {
    if (action === 'check-in') {
      setAppState({ screen: 'camera-capture' });
    } else {
      setAppState({ screen: 'check-out-dashboard' });
    }
  };

  const handlePhotoCapture = (photoUrl: string) => {
    setAppState({ screen: 'check-in-form', photoUrl });
  };

  const handleSkipPhoto = () => {
    setAppState({ screen: 'check-in-form' });
  };

  const handleCheckInSuccess = () => {
    setAppState({ screen: 'thank-you', type: 'visitor-checkin' });
  };

  const handleCheckOutSuccess = () => {
    setAppState({ screen: 'thank-you', type: 'visitor-checkout' });
  };

  const handleLateCheckInSuccess = () => {
    setAppState({ screen: 'thank-you', type: 'late-checkin' });
  };

  const handleBackToWelcome = () => {
    setAppState({ screen: 'welcome' });
  };

  const handleBackToVisitorFlow = () => {
    setAppState({ screen: 'visitor-flow' });
  };

  switch (appState.screen) {
    case 'welcome':
      return <WelcomeScreen onSelectUserType={handleUserTypeSelect} />;
    
    case 'visitor-flow':
      return (
        <VisitorFlow
          onBack={handleBackToWelcome}
          onSelectAction={handleVisitorAction}
        />
      );
    
    case 'camera-capture':
      return (
        <CameraCapture
          onPhotoCapture={handlePhotoCapture}
          onSkip={handleSkipPhoto}
        />
      );
    
    case 'check-in-form':
      return (
        <CheckInForm
          onBack={handleBackToVisitorFlow}
          photoUrl={appState.photoUrl}
          onSuccess={handleCheckInSuccess}
        />
      );
    
    case 'check-out-dashboard':
      return (
        <CheckOutDashboard
          onBack={handleBackToVisitorFlow}
          onSuccess={handleCheckOutSuccess}
        />
      );
    
    case 'late-check-in':
      return (
        <LateCheckInForm
          onBack={handleBackToWelcome}
          onSuccess={handleLateCheckInSuccess}
        />
      );
    
    case 'thank-you':
      return (
        <ThankYouScreen
          type={appState.type}
          onHome={handleBackToWelcome}
        />
      );
    
    default:
      return <WelcomeScreen onSelectUserType={handleUserTypeSelect} />;
  }
}
import React, { useEffect, useState } from 'react';
import { playShutterSound, initShutterSound } from '../utils/shutterSound';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Enable audio on first interaction
  const handleInteraction = async () => {
    if (!audioEnabled) {
      setAudioEnabled(true);
      // Initialize and play sound
      await initShutterSound();
      playShutterSound();
      
      // Also trigger flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
    }
  };

  useEffect(() => {
    // Try to initialize sound on load
    initShutterSound();
    
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Logo appears with camera sound
    timers.push(setTimeout(() => {
      setAnimationPhase(1);
      
      // Try to play sound
      playShutterSound();
      
      // Trigger flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
    }, 100));
    
    // Phase 2: App name appears
    timers.push(setTimeout(() => setAnimationPhase(2), 600));
    
    // Phase 3: Tagline appears
    timers.push(setTimeout(() => setAnimationPhase(3), 1100));
    
    // Phase 4: Loading bar appears
    timers.push(setTimeout(() => setAnimationPhase(4), 1600));
    
    // Phase 5: Almost done
    timers.push(setTimeout(() => setAnimationPhase(5), 5500));
    
    // Complete and fade out
    timers.push(setTimeout(() => {
      setAnimationPhase(6);
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }, 6000));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onComplete]);

  return (
    <div 
      className={`splash-screen ${animationPhase === 6 ? 'fade-out' : ''}`}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Flash Effect */}
      {showFlash && <div className="camera-flash" />}
      
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      {/* Logo Container */}
      <div className="splash-content">
        {/* Logo */}
        <div className={`logo-container ${animationPhase >= 1 ? 'show' : ''}`}>
          <div className="logo-image-wrapper">
            <img src="/logo.png" alt="InventoScan Logo" className="logo-image" />
            {animationPhase >= 1 && (
              <div className="scan-animation">
                <div className="scan-line-vertical"></div>
              </div>
            )}
          </div>
        </div>

        {/* App Name */}
        <div className={`app-name ${animationPhase >= 2 ? 'show' : ''}`}>
          <span className="name-invento">Invento</span>
          <span className="name-scan">Scan</span>
        </div>

        {/* Tagline */}
        <div className={`app-tagline ${animationPhase >= 3 ? 'show' : ''}`}>
          Professional Inventory Management
        </div>

        {/* Loading Bar */}
        <div className={`loading-container ${animationPhase >= 4 ? 'show' : ''}`}>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <div className="loading-text">
            {animationPhase < 5 ? 'Initialisiere...' : 'Bereit!'}
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="splash-footer">
        <div className="pulse-ring"></div>
        <div className="pulse-ring delay-1"></div>
        <div className="pulse-ring delay-2"></div>
      </div>
    </div>
  );
};
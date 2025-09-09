import { useState, useEffect } from 'react';

type Orientation = 'portrait' | 'landscape';
type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface OrientationState {
  orientation: Orientation;
  deviceType: DeviceType;
  isIpad: boolean;
  width: number;
  height: number;
}

export const useOrientation = (): OrientationState => {
  const getDeviceType = (width: number): DeviceType => {
    if (width < 768) return 'mobile';
    if (width < 1367) return 'tablet';
    return 'desktop';
  };

  const getOrientation = (): Orientation => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      return 'portrait';
    }
    return 'landscape';
  };

  const isIpadDevice = (): boolean => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIpadUA = userAgent.includes('ipad');
    const isIpadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1366;
    
    return isIpadUA || isIpadOS || isTabletSize;
  };

  const [state, setState] = useState<OrientationState>(() => ({
    orientation: getOrientation(),
    deviceType: getDeviceType(window.innerWidth),
    isIpad: isIpadDevice(),
    width: window.innerWidth,
    height: window.innerHeight
  }));

  useEffect(() => {
    const handleOrientationChange = () => {
      setState({
        orientation: getOrientation(),
        deviceType: getDeviceType(window.innerWidth),
        isIpad: isIpadDevice(),
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Listen for orientation changes
    const orientationQuery = window.matchMedia('(orientation: portrait)');
    
    // Modern browsers
    if (orientationQuery.addEventListener) {
      orientationQuery.addEventListener('change', handleOrientationChange);
    } else if (orientationQuery.addListener) {
      // Legacy browsers
      orientationQuery.addListener(handleOrientationChange);
    }

    // Also listen for resize events
    window.addEventListener('resize', handleOrientationChange);
    
    // Handle visibility change (for when switching apps on iPad)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleOrientationChange();
      }
    });

    return () => {
      if (orientationQuery.removeEventListener) {
        orientationQuery.removeEventListener('change', handleOrientationChange);
      } else if (orientationQuery.removeListener) {
        orientationQuery.removeListener(handleOrientationChange);
      }
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return state;
};

// Helper hook for responsive classes
export const useResponsiveClass = () => {
  const { orientation, deviceType, isIpad } = useOrientation();
  
  const getLayoutClass = () => {
    if (isIpad) {
      return `ipad-${orientation}`;
    }
    return `${deviceType}-${orientation}`;
  };

  const shouldShowSideNav = () => {
    return isIpad && orientation === 'landscape';
  };

  const shouldShowBottomNav = () => {
    return (isIpad && orientation === 'portrait') || deviceType === 'mobile';
  };

  const getGridColumns = () => {
    if (isIpad) {
      return orientation === 'landscape' ? 4 : 2;
    }
    if (deviceType === 'mobile') return 1;
    return 4;
  };

  return {
    layoutClass: getLayoutClass(),
    showSideNav: shouldShowSideNav(),
    showBottomNav: shouldShowBottomNav(),
    gridColumns: getGridColumns(),
    orientation,
    deviceType,
    isIpad
  };
};
'use client';

import { useEffect } from 'react';
import { useLocationStore } from '@/lib/store/locationStore';

export function useGeolocation(autoRequest = false) {
  const {
    location,
    status,
    error,
    requestLocation,
    watchLocation,
    stopWatching,
    clearLocation,
    setLocation,
  } = useLocationStore();

  useEffect(() => {
    if (autoRequest && status === 'idle') {
      requestLocation();
    }
  }, [autoRequest, status, requestLocation]);

  return {
    location,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isDenied: status === 'denied',
    hasLocation: location !== null,
    requestLocation,
    watchLocation,
    stopWatching,
    clearLocation,
    setLocation,
  };
}

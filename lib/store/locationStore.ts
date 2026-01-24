import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserLocation, GeolocationStatus } from '@/types/geolocation';

interface LocationStore {
  location: UserLocation | null;
  status: GeolocationStatus;
  error: string | null;
  watchId: number | null;

  // Actions
  requestLocation: () => void;
  watchLocation: () => void;
  stopWatching: () => void;
  clearLocation: () => void;
  setLocation: (location: UserLocation) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      location: null,
      status: 'idle',
      error: null,
      watchId: null,

      requestLocation: () => {
        if (!navigator.geolocation) {
          set({ status: 'unavailable', error: 'Geolocation is not supported by your browser' });
          return;
        }

        set({ status: 'loading', error: null });

        navigator.geolocation.getCurrentPosition(
          (position) => {
            set({
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
              },
              status: 'success',
              error: null,
            });
          },
          (error) => {
            let status: GeolocationStatus = 'error';
            let message = 'Failed to get location';

            switch (error.code) {
              case error.PERMISSION_DENIED:
                status = 'denied';
                message = 'Location permission denied';
                break;
              case error.POSITION_UNAVAILABLE:
                status = 'unavailable';
                message = 'Location information unavailable';
                break;
              case error.TIMEOUT:
                status = 'timeout';
                message = 'Location request timed out';
                break;
            }

            set({ status, error: message });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          }
        );
      },

      watchLocation: () => {
        if (!navigator.geolocation) {
          set({ status: 'unavailable', error: 'Geolocation is not supported by your browser' });
          return;
        }

        const { watchId } = get();
        if (watchId !== null) {
          return; // Already watching
        }

        set({ status: 'loading', error: null });

        const id = navigator.geolocation.watchPosition(
          (position) => {
            set({
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
              },
              status: 'success',
              error: null,
            });
          },
          (error) => {
            let status: GeolocationStatus = 'error';
            let message = 'Failed to get location';

            switch (error.code) {
              case error.PERMISSION_DENIED:
                status = 'denied';
                message = 'Location permission denied';
                break;
              case error.POSITION_UNAVAILABLE:
                status = 'unavailable';
                message = 'Location information unavailable';
                break;
              case error.TIMEOUT:
                status = 'timeout';
                message = 'Location request timed out';
                break;
            }

            set({ status, error: message });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000, // 1 minute
          }
        );

        set({ watchId: id });
      },

      stopWatching: () => {
        const { watchId } = get();
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
          set({ watchId: null });
        }
      },

      clearLocation: () => {
        const { watchId } = get();
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
        set({
          location: null,
          status: 'idle',
          error: null,
          watchId: null,
        });
      },

      setLocation: (location: UserLocation) => {
        set({ location, status: 'success', error: null });
      },
    }),
    {
      name: 'kaetsaan-location',
      partialize: (state) => ({
        location: state.location,
        status: state.status === 'success' ? 'success' : 'idle',
      }),
    }
  )
);

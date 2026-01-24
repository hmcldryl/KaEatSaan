export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export type GeolocationStatus =
  | 'idle'           // Not yet requested
  | 'loading'        // Requesting location
  | 'success'        // Location obtained
  | 'denied'         // User denied permission
  | 'unavailable'    // Geolocation not available
  | 'timeout'        // Request timed out
  | 'error';         // Other error

export interface GeolocationState {
  location: UserLocation | null;
  status: GeolocationStatus;
  error: string | null;
}

'use client';

import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { Box, CircularProgress } from '@mui/material';

// Dynamic import for Leaflet - it requires window object
const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
        borderRadius: 2,
      }}
    >
      <CircularProgress size={40} />
    </Box>
  ),
});

interface MapContainerProps {
  center?: LatLngExpression;
  zoom?: number;
  markerPosition?: LatLngExpression | null;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string | number;
}

export default function MapContainer(props: MapContainerProps) {
  return <MapInner {...props} />;
}

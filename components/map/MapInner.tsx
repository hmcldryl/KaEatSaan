"use client";

import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, Icon, LeafletMouseEvent } from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icon in Leaflet with webpack/Next.js
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapInnerProps {
  center?: LatLngExpression;
  zoom?: number;
  markerPosition?: LatLngExpression | null;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string | number;
}

function MapClickHandler({
  onClick,
}: {
  onClick?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapInner({
  center = [14.5995, 120.9842], // Manila, Philippines
  zoom = 13,
  markerPosition,
  onMapClick,
  height = 300,
}: MapInnerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        Loading map...
      </div>
    );
  }

  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: "100%",
        borderRadius: "8px",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onClick={onMapClick} />
      {markerPosition && (
        <Marker position={markerPosition} icon={defaultIcon} />
      )}
    </LeafletMapContainer>
  );
}

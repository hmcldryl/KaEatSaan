"use client";

import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, DivIcon, LeafletMouseEvent } from "leaflet";
import { useSyncExternalStore } from "react";

const customIcon = new DivIcon({
  className: "",
  html: `
    <div style="position:relative;width:28px;height:40px;">
      <div class="kaeatsaan-marker-pulse"></div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40" style="filter:drop-shadow(0 3px 8px rgba(227,119,37,0.55))">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 9.8 14 26 14 26S28 23.8 28 14C28 6.268 21.732 0 14 0z" fill="#E37725"/>
        <circle cx="14" cy="14" r="6.5" fill="white"/>
        <circle cx="14" cy="14" r="3.5" fill="#E37725"/>
      </svg>
    </div>
  `,
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -40],
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
      if (onClick) onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapInner({
  center = [14.5995, 120.9842],
  zoom = 13,
  markerPosition,
  onMapClick,
  height = 300,
}: MapInnerProps) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const heightVal = typeof height === "number" ? `${height}px` : height;

  if (!isMounted) {
    return (
      <div
        style={{
          height: heightVal,
          background: "linear-gradient(135deg, #FFF3E8 0%, #FFE4D0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          color: "#E37725",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        Loading map…
      </div>
    );
  }

  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      style={{
        height: heightVal,
        width: "100%",
        borderRadius: "16px",
        outline: "none",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapClickHandler onClick={onMapClick} />
      {markerPosition && <Marker position={markerPosition} icon={customIcon} />}
    </LeafletMapContainer>
  );
}

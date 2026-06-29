"use client";

import { useState, useEffect } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, DivIcon, LeafletMouseEvent } from "leaflet";
import { useSyncExternalStore } from "react";

const destinationIcon = new DivIcon({
  className: "",
  html: `
    <div style="position:relative;width:24px;height:34px;">
      <div class="kaeatsaan-marker-pulse"></div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="24" height="34" style="filter:drop-shadow(0 3px 8px rgba(227,119,37,0.55))">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 9.8 14 26 14 26S28 23.8 28 14C28 6.268 21.732 0 14 0z" fill="#FF6B35"/>
        <circle cx="14" cy="14" r="6.5" fill="white"/>
        <circle cx="14" cy="14" r="3.5" fill="#FF6B35"/>
      </svg>
    </div>
  `,
  iconSize: [24, 34],
  iconAnchor: [12, 34],
  popupAnchor: [0, -34],
});

const userLocationIcon = new DivIcon({
  className: "",
  html: `<div style="width:12px;height:12px;background:#3B82F6;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,0.6)"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface MapInnerProps {
  center?: LatLngExpression;
  zoom?: number;
  markerPosition?: LatLngExpression | null;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string | number;
  userLocation?: [number, number];
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

function RouteLayer({
  from,
  to,
}: {
  from: [number, number];
  to: [number, number];
}) {
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const map = useMap();

  useEffect(() => {
    map.fitBounds([from, to], { padding: [32, 32], maxZoom: 16 });

    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const coords = data?.routes?.[0]?.geometry?.coordinates as
          | [number, number][]
          | undefined;
        if (coords) {
          setRoutePoints(coords.map(([lng, lat]) => [lat, lng]));
        }
      })
      .catch(() => {});
  }, [from, to, map]);

  if (routePoints.length === 0) return null;

  return (
    <Polyline positions={routePoints} color="#FF6B35" weight={4} opacity={0.8} />
  );
}

export default function MapInner({
  center = [14.5995, 120.9842],
  zoom = 13,
  markerPosition,
  onMapClick,
  height = 300,
  userLocation,
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
          color: "#FF6B35",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        Loading map…
      </div>
    );
  }

  const destination = markerPosition as [number, number] | null | undefined;

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
      {destination && <Marker position={destination} icon={destinationIcon} />}
      {userLocation && <Marker position={userLocation} icon={userLocationIcon} />}
      {userLocation && destination && (
        <RouteLayer from={userLocation} to={destination} />
      )}
    </LeafletMapContainer>
  );
}

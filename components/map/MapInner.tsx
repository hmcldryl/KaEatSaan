"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Map, {
  Marker,
  Source,
  Layer,
  NavigationControl,
  AttributionControl,
  useMap,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import type { FeatureCollection, LineString } from "geojson";

// OpenFreeMap — free vector tiles, no API key required.
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

type LatLng = [number, number];

interface MapInnerProps {
  center?: LatLng;
  zoom?: number;
  markerPosition?: LatLng | null;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string | number;
  userLocation?: LatLng;
  borderRadius?: string | number;
}

function DestinationPin() {
  return (
    <div style={{ position: "relative", width: 24, height: 34 }}>
      <div className="kaeatsaan-marker-pulse" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 40"
        width="24"
        height="34"
        style={{ filter: "drop-shadow(0 3px 8px rgba(227,119,37,0.55))" }}
      >
        <path
          d="M14 0C6.268 0 0 6.268 0 14c0 9.8 14 26 14 26S28 23.8 28 14C28 6.268 21.732 0 14 0z"
          fill="#FF6B35"
        />
        <circle cx="14" cy="14" r="6.5" fill="white" />
        <circle cx="14" cy="14" r="3.5" fill="#FF6B35" />
      </svg>
    </div>
  );
}

function UserDot() {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        background: "#3B82F6",
        border: "2.5px solid white",
        borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(59,130,246,0.6)",
      }}
    />
  );
}

function RouteLayer({ from, to }: { from: LatLng; to: LatLng }) {
  const [coords, setCoords] = useState<[number, number][]>([]);
  const { current: map } = useMap();
  const [fromLat, fromLng] = from;
  const [toLat, toLng] = to;

  useEffect(() => {
    map?.fitBounds(
      [
        [Math.min(fromLng, toLng), Math.min(fromLat, toLat)],
        [Math.max(fromLng, toLng), Math.max(fromLat, toLat)],
      ],
      { padding: 32, maxZoom: 16, duration: 0 },
    );

    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const c = data?.routes?.[0]?.geometry?.coordinates as
          | [number, number][]
          | undefined;
        if (c) setCoords(c);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [fromLat, fromLng, toLat, toLng, map]);

  const geojson = useMemo<FeatureCollection<LineString>>(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: coords },
        },
      ],
    }),
    [coords],
  );

  if (coords.length === 0) return null;

  return (
    <Source id="route" type="geojson" data={geojson}>
      <Layer
        id="route-line"
        type="line"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{ "line-color": "#FF6B35", "line-width": 4, "line-opacity": 0.8 }}
      />
    </Source>
  );
}

export default function MapInner({
  center = [14.5995, 120.9842],
  zoom = 13,
  markerPosition,
  onMapClick,
  height = 300,
  userLocation,
  borderRadius = "16px",
}: MapInnerProps) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const heightVal = typeof height === "number" ? `${height}px` : height;
  const borderRadiusVal = typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  if (!isMounted) {
    return (
      <div
        style={{
          height: heightVal,
          background: "linear-gradient(135deg, #FFF3E8 0%, #FFE4D0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: borderRadiusVal,
          color: "#FF6B35",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        Loading map…
      </div>
    );
  }

  const handleClick = (e: MapLayerMouseEvent) => {
    onMapClick?.(e.lngLat.lat, e.lngLat.lng);
  };

  return (
    <Map
      initialViewState={{ latitude: center[0], longitude: center[1], zoom }}
      mapStyle={MAP_STYLE}
      onClick={handleClick}
      attributionControl={false}
      style={{
        height: heightVal,
        width: "100%",
        borderRadius: borderRadiusVal,
        outline: "none",
      }}
    >
      <NavigationControl position="top-left" showCompass={false} />
      <AttributionControl compact position="bottom-right" />
      {markerPosition && (
        <Marker latitude={markerPosition[0]} longitude={markerPosition[1]} anchor="bottom">
          <DestinationPin />
        </Marker>
      )}
      {userLocation && (
        <Marker latitude={userLocation[0]} longitude={userLocation[1]} anchor="center">
          <UserDot />
        </Marker>
      )}
      {userLocation && markerPosition && (
        <RouteLayer from={userLocation} to={markerPosition} />
      )}
    </Map>
  );
}

"use client";

import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 300,
        background: "linear-gradient(135deg, #FFF3E8 0%, #FFE4D0 100%)",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#E37725",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      Loading map…
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ borderRadius: "16px", overflow: "hidden" }}
    >
      <MapInner {...props} />
    </motion.div>
  );
}

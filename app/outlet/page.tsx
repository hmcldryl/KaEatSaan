"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useFoodOutletStore } from "@/lib/store/foodOutletStore";
import OutletDetailContent from "@/components/food_outlet/OutletDetailContent";

function OutletPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { outlets, isLoading, loadOutlets } = useFoodOutletStore();

  useEffect(() => {
    if (outlets.length === 0 && !isLoading) loadOutlets();
  }, [outlets.length, isLoading, loadOutlets]);

  const outlet = id ? outlets.find((o) => o.id === id) : null;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", bgcolor: "#FFFFFF", minHeight: "100dvh", mb: "-100px", pb: "100px" }}>
      {isLoading && !outlet ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <CircularProgress sx={{ color: "#FF6B35" }} />
        </Box>
      ) : !outlet ? (
        <Box sx={{ textAlign: "center", pt: 8, px: 3 }}>
          <Typography sx={{ fontSize: "0.85rem", color: "#9CA3AF" }}>Kainan not found.</Typography>
        </Box>
      ) : (
        <OutletDetailContent outlet={outlet} mapHeight={240} headerPt={1} />
      )}
    </Box>
  );
}

export default function OutletPageWrapper() {
  return (
    <Suspense>
      <OutletPage />
    </Suspense>
  );
}

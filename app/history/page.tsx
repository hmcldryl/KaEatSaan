"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import { useHistoryStore } from "@/lib/store/historyStore";
import { FoodOutlet } from "@/types/foodOutlet";
import FoodOutletDetailModal from "@/components/food_outlet/FoodOutletDetailModal";

export default function HistoryPage() {
  const { history, getGroupedHistory, removeEntry, clearHistory } = useHistoryStore();
  const [selectedOutlet, setSelectedOutlet] = useState<FoodOutlet | null>(null);

  const grouped = getGroupedHistory();

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (history.length === 0) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", gap: 1.5 }}>
          <HistoryIcon sx={{ fontSize: 52, color: "#E5E7EB" }} />
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1F2937" }}>
            No Spin History Yet
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "#6B7280" }}>
            Start spinning the wheel to see your history!
          </Typography>
        </Box>
      </Container>
    );
  }

  const renderSection = (title: string, entries: typeof history) => {
    if (!entries.length) return null;
    return (
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", mb: 1.25 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 22, delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
            <Card sx={{ borderRadius: "14px", border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "relative" }}>
              <CardActionArea onClick={() => setSelectedOutlet(entry.outlet)}>
                <CardContent sx={{ py: 1.25, px: 2, pr: 5, "&:last-child": { pb: 1.25 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
                    <Typography sx={{ fontSize: "0.65rem", color: "#9CA3AF" }}>
                      {formatTime(entry.timestamp)}
                      {title === "Older" && ` · ${formatDate(entry.timestamp)}`}
                    </Typography>
                  </Box>

                  <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#1F2937", mb: 0.5 }}>
                    {entry.outlet.name}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 0.5 }}>
                    <Chip
                      label={entry.outlet.cuisine}
                      size="small"
                      sx={{ bgcolor: "#FF6B35", color: "#fff", fontWeight: 600, fontSize: "0.68rem", height: 20 }}
                    />
                    <Chip
                      label={"₱".repeat(entry.outlet.budget)}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: "0.68rem", height: 20, borderColor: "#E5E7EB" }}
                    />
                    {entry.outlet.distance && (
                      <Chip
                        label={`${entry.outlet.distance.toFixed(1)} km`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.68rem", height: 20 }}
                      />
                    )}
                  </Box>

                  <Typography sx={{ fontSize: "0.7rem", color: "#9CA3AF" }}>
                    📍 {entry.outlet.location.address}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <IconButton
                aria-label="remove from history"
                onClick={() => removeEntry(entry.id)}
                size="small"
                sx={{ position: "absolute", top: 8, right: 8, color: "#D1D5DB", "&:hover": { color: "#EF4444" } }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 3 }}>
        <Box sx={{ mb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: "#1F2937" }}>
              Recent Selections
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#9CA3AF", mt: 0.25 }}>
              {history.length} spin{history.length !== 1 ? "s" : ""} in history
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={clearHistory}
            sx={{ borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, color: "#9CA3AF", borderColor: "#E5E7EB", "&:hover": { borderColor: "#FF6B35", color: "#FF6B35" } }}
          >
            Clear All
          </Button>
        </Box>

        {renderSection("Today", grouped.today)}
        {renderSection("Yesterday", grouped.yesterday)}
        {renderSection("This Week", grouped.thisWeek)}
        {renderSection("Older", grouped.older)}
      </Box>

      <FoodOutletDetailModal outlet={selectedOutlet} open={selectedOutlet !== null} onClose={() => setSelectedOutlet(null)} />
    </Container>
  );
}

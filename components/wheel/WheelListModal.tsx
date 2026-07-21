"use client";

import { useState, useEffect, useMemo } from "react";
import { Reorder, useDragControls } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FoodOutlet } from "@/types/foodOutlet";
import { useFoodOutletStore } from "@/lib/store/foodOutletStore";
import { useWheelListStore } from "@/lib/store/wheelListStore";

function DraggableRow({ outlet, onHide }: { outlet: FoodOutlet; onHide: () => void }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={outlet} dragListener={false} dragControls={controls} as="li" style={{ listStyle: "none" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 0.75,
          px: 0.5,
          bgcolor: "#fff",
          borderRadius: 1,
          mb: 0.5,
          border: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <Box
          onPointerDown={(e) => controls.start(e)}
          sx={{ cursor: "grab", touchAction: "none", color: "#CBD5E1", display: "flex", alignItems: "center", pl: 0.5 }}
        >
          <DragHandleIcon fontSize="small" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.3 }} noWrap>
            {outlet.name}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#9CA3AF" }} noWrap>
            {outlet.classification} - {outlet.cuisine}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onHide} sx={{ color: "#CBD5E1", "&:hover": { color: "#9CA3AF" } }}>
          <VisibilityOffIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Reorder.Item>
  );
}

export default function WheelListModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { filteredOutlets } = useFoodOutletStore();
  const { customOrder, excluded, setOrder, toggleExclude, reset } = useWheelListStore();

  const activeOutlets = useMemo(() => {
    let list = filteredOutlets.filter((o) => !excluded.includes(o.id));
    if (customOrder && customOrder.length > 0) {
      const orderMap = new Map(customOrder.map((id, i) => [id, i]));
      list = [...list].sort((a, b) => {
        const ai = orderMap.has(a.id) ? orderMap.get(a.id)! : Infinity;
        const bi = orderMap.has(b.id) ? orderMap.get(b.id)! : Infinity;
        return ai - bi;
      });
    }
    return list;
  }, [filteredOutlets, customOrder, excluded]);

  const excludedOutlets = useMemo(
    () => filteredOutlets.filter((o) => excluded.includes(o.id)),
    [filteredOutlets, excluded]
  );

  const [localOrder, setLocalOrder] = useState<FoodOutlet[]>(activeOutlets);

  useEffect(() => {
    const localIds = localOrder.map((o) => o.id).join(",");
    const activeIds = activeOutlets.map((o) => o.id).join(",");
    if (localIds !== activeIds) setLocalOrder(activeOutlets);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOutlets]);

  const handleReorder = (newOrder: FoodOutlet[]) => {
    setLocalOrder(newOrder);
    setOrder(newOrder.map((o) => o.id));
  };

  const isCustomized = customOrder !== null || excluded.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", mx: 2 } }}
    >
      <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>
            Kainan List
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#9CA3AF", mt: 0.25 }}>
            {localOrder.length} outlet{localOrder.length !== 1 ? "s" : ""} · drag to reorder
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, pb: 1, maxHeight: "58vh", overflowY: "auto" }}>
        {localOrder.length === 0 && excludedOutlets.length === 0 && (
          <Typography sx={{ color: "#9CA3AF", fontSize: "0.85rem", textAlign: "center", py: 4 }}>
            No outlets match current filters
          </Typography>
        )}

        {localOrder.length > 0 && (
          <Reorder.Group
            axis="y"
            values={localOrder}
            onReorder={handleReorder}
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {localOrder.map((outlet) => (
              <DraggableRow
                key={outlet.id}
                outlet={outlet}
                onHide={() => toggleExclude(outlet.id)}
              />
            ))}
          </Reorder.Group>
        )}

        {excludedOutlets.length > 0 && (
          <>
            <Divider sx={{ my: 1.5 }}>
              <Typography sx={{ fontSize: "0.68rem", color: "#CBD5E1", px: 1 }}>
                hidden from wheel
              </Typography>
            </Divider>
            {excludedOutlets.map((outlet) => (
              <Box
                key={outlet.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 0.75,
                  px: 0.5,
                  mb: 0.5,
                  opacity: 0.45,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{ fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.3, textDecoration: "line-through" }}
                    noWrap
                  >
                    {outlet.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: "#9CA3AF" }} noWrap>
                    {outlet.cuisine}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => toggleExclude(outlet.id)} sx={{ color: "#9CA3AF" }}>
                  <VisibilityIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            ))}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5, justifyContent: "space-between" }}>
        <Button
          size="small"
          onClick={reset}
          disabled={!isCustomized}
          sx={{ color: "#9CA3AF", fontSize: "0.75rem", textTransform: "none" }}
        >
          Reset order
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: "#FF6B35",
            "&:hover": { bgcolor: "#e55a25" },
            borderRadius: 2,
            fontSize: "0.75rem",
            textTransform: "none",
            boxShadow: "none",
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

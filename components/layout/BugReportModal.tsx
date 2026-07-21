"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const GITHUB_ISSUES_URL = "https://github.com/hmcldryl/KaEatSaan/issues/new";

interface BugReportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BugReportModal({ open, onClose }: BugReportModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  const handleSubmit = () => {
    const params = new URLSearchParams({ labels: "bug" });
    if (title.trim()) params.set("title", title.trim());
    if (description.trim()) params.set("body", description.trim());
    window.open(`${GITHUB_ISSUES_URL}?${params.toString()}`, "_blank", "noopener,noreferrer");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", mx: 2 } }}
    >
      <DialogTitle sx={{ pb: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>
            Report a bug
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#9CA3AF", mt: 0.25 }}>
            Opens a pre-filled GitHub issue in a new tab
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Title"
          placeholder="e.g. Wheel freezes after spinning twice"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{ maxLength: 120 }}
        />
        <TextField
          fullWidth
          multiline
          minRows={4}
          size="small"
          label="What happened?"
          placeholder="Steps to reproduce, what you expected, what you got instead..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Typography sx={{ fontSize: "0.68rem", color: "#9CA3AF" }}>
          You&apos;ll need a GitHub account to submit — the form just saves you the typing.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2, pt: 0.5 }}>
        <Button onClick={handleClose} size="small" sx={{ color: "#6B7280" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
          onClick={handleSubmit}
          disabled={!title.trim()}
          sx={{ bgcolor: "#FF6B35", "&:hover": { bgcolor: "#E55A20" }, borderRadius: "9999px", fontWeight: 700 }}
        >
          Continue on GitHub
        </Button>
      </DialogActions>
    </Dialog>
  );
}

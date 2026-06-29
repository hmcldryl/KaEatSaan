"use client";

import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Alert,
  IconButton,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  CuisineType,
  BudgetLevel,
  ClassificationType,
  FoodOutlet,
} from "@/types/foodOutlet";
import { CUISINES, CLASSIFICATIONS } from "@/lib/constants/foodOutlets";
import { useFoodOutletStore } from "@/lib/store/foodOutletStore";
import { useAuthStore } from "@/lib/store/authStore";

interface EditFoodOutletModalProps {
  outlet: FoodOutlet;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const BUDGET_LABELS: Record<BudgetLevel, string> = {
  1: "₱ - Budgetarian",
  2: "₱₱ - Goods pag payday",
  3: "₱₱₱ - Mahal",
  4: "₱₱₱₱ - Masakit sa bulsa",
  5: "₱₱₱₱₱ - Anak ng contractor",
};

export default function EditFoodOutletModal({
  outlet,
  open,
  onClose,
  onSaved,
}: EditFoodOutletModalProps) {
  const { communityUpdateOutlet } = useFoodOutletStore();
  const { user } = useAuthStore();

  const [name, setName] = useState(outlet.name);
  const [classification, setClassification] = useState<ClassificationType>(outlet.classification || CLASSIFICATIONS[0]);
  const [cuisine, setCuisine] = useState<CuisineType>(CUISINES.includes(outlet.cuisine) ? outlet.cuisine : CUISINES[0]);
  const [budget, setBudget] = useState<BudgetLevel>(outlet.budget || 1);
  const [isOpen, setIsOpen] = useState(outlet.isOpen !== false);
  const [description, setDescription] = useState(outlet.description || "");
  const [tags, setTags] = useState<string[]>(outlet.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [contactNumber, setContactNumber] = useState(outlet.contactNumber || "");
  const [facebookUrl, setFacebookUrl] = useState(outlet.facebookUrl || "");
  const [messengerUsername, setMessengerUsername] = useState(outlet.messengerUsername || "");

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddTag(); }
  };

  const handleSubmit = async () => {
    if (!user) { setError("Must be signed in to edit."); return; }
    if (!captchaToken) { setError("Please complete the CAPTCHA."); return; }
    if (!name.trim()) { setError("Name is required."); return; }

    setIsSubmitting(true);
    setError(null);

    const updates: Partial<FoodOutlet> = {
      name: name.trim(),
      classification,
      cuisine,
      budget,
      isOpen,
      description: description.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      contactNumber: contactNumber.trim() || undefined,
      facebookUrl: facebookUrl.trim() || undefined,
      messengerUsername: messengerUsername.trim() || undefined,
    };

    const ok = await communityUpdateOutlet(
      outlet,
      updates,
      user.uid,
      user.displayName || "Anonymous",
      user.photoURL || undefined
    );

    setIsSubmitting(false);
    if (ok) {
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
      onSaved?.();
      onClose();
    } else {
      setError("Failed to save. Please try again.");
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", maxHeight: "90dvh", mx: 0.5, bgcolor: "#FFFFFF" },
      }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        sx={{ position: "absolute", top: 8, right: 8, color: "#9CA3AF", "&:hover": { color: "#6B7280", bgcolor: "#F3F4F6" } }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogTitle sx={{ borderBottom: "1px solid #F3F4F6", py: 1.75, pr: 5 }}>
        <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: "#1F2937" }}>
          Edit Kainan
        </Typography>
        <Typography sx={{ fontSize: "0.72rem", color: "#9CA3AF", mt: 0.25 }}>
          Community edit — changes are logged
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2, fontSize: "0.75rem" }}>{error}</Alert>}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Classification</InputLabel>
            <Select value={classification} label="Classification" onChange={(e) => setClassification(e.target.value as ClassificationType)}>
              {CLASSIFICATIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Cuisine Type</InputLabel>
            <Select value={cuisine} label="Cuisine Type" onChange={(e) => setCuisine(e.target.value as CuisineType)}>
              {CUISINES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Budget Level</InputLabel>
            <Select value={budget} label="Budget Level" onChange={(e) => setBudget(e.target.value as BudgetLevel)}>
              {([1, 2, 3, 4, 5] as BudgetLevel[]).map((b) => <MenuItem key={b} value={b}>{BUDGET_LABELS[b]}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Switch checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} sx={{ "& .Mui-checked + .MuiSwitch-track": { bgcolor: "#FF6B35" } }} />}
            label={<Typography sx={{ fontSize: "0.78rem", fontWeight: 600 }}>Currently open</Typography>}
          />

          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            size="small"
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: "text.secondary" }}>
              Tags (optional, max 5)
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                size="small"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag..."
                disabled={tags.length >= 5}
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" onClick={handleAddTag} disabled={!tagInput.trim() || tags.length >= 5} size="small">
                Add
              </Button>
            </Box>
            {tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {tags.map((tag) => <Chip key={tag} label={tag} size="small" onDelete={() => setTags(tags.filter((t) => t !== tag))} />)}
              </Box>
            )}
          </Box>

          <Divider />

          <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>
            Contact & Social
          </Typography>

          <TextField
            label="Contact Number (optional)"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            fullWidth
            size="small"
            placeholder="e.g., 09xx-xxx-xxxx"
            inputProps={{ inputMode: "tel" }}
          />

          <TextField
            label="Facebook Page URL (optional)"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            fullWidth
            size="small"
            placeholder="https://facebook.com/pagename"
          />

          <TextField
            label="Messenger Username (optional)"
            value={messengerUsername}
            onChange={(e) => setMessengerUsername(e.target.value)}
            fullWidth
            size="small"
            placeholder="username (without m.me/)"
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              ref={captchaRef}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ borderRadius: "9999px", fontWeight: 700, fontSize: "0.75rem", borderColor: "#E5E7EB", color: "#6B7280", borderWidth: 1.5, "&:hover": { borderWidth: 1.5 } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={isSubmitting || !captchaToken}
          sx={{ borderRadius: "9999px", fontWeight: 700, fontSize: "0.75rem", bgcolor: "#FF6B35", "&:hover": { bgcolor: "#E55A20" } }}
        >
          {isSubmitting ? <CircularProgress size={18} color="inherit" /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

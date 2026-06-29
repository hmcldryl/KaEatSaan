"use client";

import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  CuisineType,
  BudgetLevel,
  ClassificationType,
  Location,
} from "@/types/foodOutlet";
import { CUISINES } from "@/lib/constants/foodOutlets";
import { useFoodOutletStore } from "@/lib/store/foodOutletStore";
import { useAuthStore } from "@/lib/store/authStore";
import LocationPicker from "@/components/map/LocationPicker";
import { CLASSIFICATIONS } from "@/lib/constants/foodOutlets";

interface AddFoodOutletModalProps {
  open: boolean;
  onClose: () => void;
}

const BUDGET_LABELS: Record<BudgetLevel, string> = {
  1: "₱ - Budgetarian",
  2: "₱₱ - Goods pag payday",
  3: "₱₱₱ - Mahal",
  4: "₱₱₱₱ - Masakit sa bulsa",
  5: "₱₱₱₱₱ - Anak ng contractor",
};

export default function AddFoodOutletModal({
  open,
  onClose,
}: AddFoodOutletModalProps) {
  const { addFoodOutlet } = useFoodOutletStore();
  const { user } = useAuthStore();

  const [name, setName] = useState("");
  const [classification, setClassification] =
    useState<ClassificationType>("Karinderia");
  const [cuisine, setCuisine] = useState<CuisineType>("Filipino");
  const [budget, setBudget] = useState<BudgetLevel>(2);
  const [location, setLocation] = useState<Location | null>(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [messengerUsername, setMessengerUsername] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setCuisine("Filipino");
    setClassification("Karinderia");
    setBudget(2);
    setLocation(null);
    setDescription("");
    setTags([]);
    setTagInput("");
    setContactNumber("");
    setFacebookUrl("");
    setMessengerUsername("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }
    if (!location) {
      setError("Please select a location on the map");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newFoodOutlet = {
        name: name.trim(),
        cuisine,
        budget,
        location,
        classification,
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        contactNumber: contactNumber.trim() || undefined,
        facebookUrl: facebookUrl.trim() || undefined,
        messengerUsername: messengerUsername.trim() || undefined,
        isOpen: true,
        createdAt: new Date().toISOString(),
        createdBy: user?.uid,
        reviewCount: 0,
        averageRating: 0,
      };

      const id = await addFoodOutlet(newFoodOutlet);

      if (id) {
        handleClose();
      } else {
        setError("Failed to add kainan. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxHeight: "90dvh",
          mx: 0.5,
          bgcolor: "#FFFFFF",
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "#9CA3AF",
          "&:hover": { color: "#6B7280", bgcolor: "#F3F4F6" },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogTitle sx={{ borderBottom: "1px solid #F3F4F6", py: 1.75, pr: 5 }}>
        <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: "#1F2937" }}>
          Add New Kainan
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            size="small"
            placeholder="e.g., Jollibee, Mang Inasal"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Classification</InputLabel>
            <Select
              value={classification}
              label="Classification"
              onChange={(e) =>
                setClassification(e.target.value as ClassificationType)
              }
            >
              {CLASSIFICATIONS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Cuisine Type</InputLabel>
            <Select
              value={cuisine}
              label="Cuisine Type"
              onChange={(e) => setCuisine(e.target.value as CuisineType)}
            >
              {CUISINES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Budget Level</InputLabel>
            <Select
              value={budget}
              label="Budget Level"
              onChange={(e) => setBudget(e.target.value as BudgetLevel)}
            >
              {([1, 2, 3, 4, 5] as BudgetLevel[]).map((b) => (
                <MenuItem key={b} value={b}>
                  {BUDGET_LABELS[b]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ color: "text.secondary" }}
            >
              Location *
            </Typography>
            <LocationPicker
              value={location}
              onChange={setLocation}
              height={200}
            />
          </Box>

          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            size="small"
            placeholder="Brief description of the food place..."
          />

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ color: "text.secondary" }}
            >
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
              <Button
                variant="outlined"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                size="small"
              >
                Add
              </Button>
            </Box>
            {tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ borderTop: "1px solid #F3F4F6", pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: "text.secondary", fontWeight: 700 }}>
              Contact & Social (optional)
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                fullWidth
                size="small"
                placeholder="e.g., 09xx-xxx-xxxx"
                inputProps={{ inputMode: "tel" }}
              />
              <TextField
                label="Facebook Page URL"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                fullWidth
                size="small"
                placeholder="https://facebook.com/pagename"
              />
              <TextField
                label="Messenger Username"
                value={messengerUsername}
                onChange={(e) => setMessengerUsername(e.target.value)}
                fullWidth
                size="small"
                placeholder="username (without m.me/)"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1 }}>
        <Button
          onClick={handleClose}
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
          disabled={isSubmitting}
          sx={{
            borderRadius: "9999px",
            fontWeight: 700,
            fontSize: "0.75rem",
            bgcolor: "#FF6B35",
            "&:hover": { bgcolor: "#E55A20" },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Kainan"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

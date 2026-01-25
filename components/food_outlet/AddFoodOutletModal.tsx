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
          borderRadius: "8px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #F3F4F6",
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Add New Kainan
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "#6B7280" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            placeholder="e.g., Jollibee, Mang Inasal"
          />

          <FormControl fullWidth>
            <InputLabel>Classification</InputLabel>
            <Select
              value={cuisine}
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

          <FormControl fullWidth>
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

          <FormControl fullWidth>
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
              height={250}
            />
          </Box>

          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#FF6B35",
            "&:hover": { backgroundColor: "#E55A2B" },
            px: 4,
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

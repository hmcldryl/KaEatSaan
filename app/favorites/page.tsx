"use client";

import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import { useFoodOutletStore } from "@/lib/store/foodOutletStore";
import { FoodOutlet } from "@/types/foodOutlet";
import FoodOutletDetailModal from "@/components/food_outlet/FoodOutletDetailModal";
import StarRating from "@/components/reviews/StarRating";

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const { outlets, loadOutlets } = useFoodOutletStore();
  const [selectedOutlet, setSelectedOutlet] = useState<FoodOutlet | null>(null);

  useEffect(() => {
    if (outlets.length === 0) loadOutlets();
  }, [outlets.length, loadOutlets]);

  const favoriteOutlets = outlets.filter((o) => favorites.includes(o.id));

  if (favorites.length === 0) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", gap: 1.5 }}>
          <FavoriteIcon sx={{ fontSize: 52, color: "#E5E7EB" }} />
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1F2937" }}>
            No Suki Kainan Yet
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "#6B7280" }}>
            Start spinning the wheel and add your favorite food places!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 3 }}>
        <Box sx={{ mb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: "#1F2937" }}>
              Suki Kainan
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#9CA3AF", mt: 0.25 }}>
              {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={clearFavorites}
            sx={{ borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, color: "#9CA3AF", borderColor: "#E5E7EB", "&:hover": { borderColor: "#FF6B35", color: "#FF6B35" } }}
          >
            Clear All
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {favoriteOutlets.map((outlet) => (
            <Card key={outlet.id} sx={{ borderRadius: "14px", border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <CardActionArea onClick={() => setSelectedOutlet(outlet)}>
                <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#1F2937", mb: 0.75 }}>
                        {outlet.name}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 0.75 }}>
                        <Chip
                          label={outlet.cuisine}
                          size="small"
                          sx={{ bgcolor: "#FF6B35", color: "#fff", fontWeight: 600, fontSize: "0.68rem", height: 20 }}
                        />
                        <Chip
                          label={"₱".repeat(outlet.budget)}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: "0.68rem", height: 20, borderColor: "#E5E7EB" }}
                        />
                        {outlet.distance && (
                          <Chip
                            label={`${outlet.distance.toFixed(1)} km`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.68rem", height: 20 }}
                          />
                        )}
                      </Box>

                      {(outlet.averageRating || 0) > 0 && (
                        <Box sx={{ mb: 0.5 }}>
                          <StarRating value={outlet.averageRating || 0} readonly size="small" showValue count={outlet.reviewCount} />
                        </Box>
                      )}

                      <Typography sx={{ fontSize: "0.7rem", color: "#9CA3AF" }}>
                        📍 {outlet.location.address}
                      </Typography>

                      {outlet.description && (
                        <Typography sx={{ fontSize: "0.7rem", color: "#6B7280", mt: 0.5, lineHeight: 1.4 }}>
                          {outlet.description}
                        </Typography>
                      )}

                      {outlet.tags && outlet.tags.length > 0 && (
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.75 }}>
                          {outlet.tags.slice(0, 3).map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: "0.62rem", height: 18 }} />
                          ))}
                        </Box>
                      )}
                    </Box>

                    <IconButton
                      aria-label="remove from favorites"
                      onClick={(e) => { e.stopPropagation(); removeFavorite(outlet.id); }}
                      size="small"
                      sx={{ ml: 1, flexShrink: 0, color: "#D1D5DB", "&:hover": { color: "#EF4444" } }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>

      <FoodOutletDetailModal outlet={selectedOutlet} open={selectedOutlet !== null} onClose={() => setSelectedOutlet(null)} />
    </Container>
  );
}

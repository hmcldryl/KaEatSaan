"use client";

import { useState, useEffect } from "react";
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
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import { useFoodOutletStore } from "@/lib/store/foodOutletStore";
import { FoodOutlet } from "@/types/foodOutlet";
import RestaurantDetailModal from "@/components/food_outlet/FoodOutletDetailModal";
import StarRating from "@/components/reviews/StarRating";

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const { outlets, loadOutlets } = useFoodOutletStore();
  const [selectedOutlet, setSelectedOutlet] = useState<FoodOutlet | null>(null);

  useEffect(() => {
    if (outlets.length === 0) {
      loadOutlets();
    }
  }, [outlets.length, loadOutlets]);

  const favoriteOutlets = outlets.filter((o) => favorites.includes(o.id));

  const getBudgetDisplay = (budget: number) => {
    return "₱".repeat(budget);
  };

  if (favorites.length === 0) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
            gap: 2,
          }}
        >
          <FavoriteIcon sx={{ fontSize: 80, color: "#E5E7EB" }} />
          <Typography variant="h5" color="text.primary" fontWeight={600}>
            No Suki Kainan Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start spinning the wheel and add your favorite food places!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              gutterBottom
            >
              Suki Kainan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
            </Typography>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={clearFavorites}
            >
              Clear All
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {favoriteOutlets.map((outlet) => (
            <Card key={outlet.id} sx={{ position: "relative" }}>
              <CardActionArea onClick={() => setSelectedOutlet(outlet)}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {outlet.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={outlet.cuisine}
                          size="small"
                          color="secondary"
                        />
                        <Chip
                          label={getBudgetDisplay(outlet.budget)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {outlet.distance && (
                          <Chip
                            label={`${outlet.distance.toFixed(1)} km`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {(outlet.averageRating || 0) > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <StarRating
                            value={outlet.averageRating || 0}
                            readonly
                            size="small"
                            showValue
                            count={outlet.reviewCount}
                          />
                        </Box>
                      )}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {outlet.location.address}
                      </Typography>

                      {outlet.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {outlet.description}
                        </Typography>
                      )}

                      {outlet.tags && outlet.tags.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                            mt: 1,
                          }}
                        >
                          {outlet.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </Box>

                    <IconButton
                      aria-label="remove from favorites"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(outlet.id);
                      }}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>

      <RestaurantDetailModal
        restaurant={selectedOutlet}
        open={selectedOutlet !== null}
        onClose={() => setSelectedOutlet(null)}
      />
    </Container>
  );
}

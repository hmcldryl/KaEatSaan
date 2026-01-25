"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ClearIcon from "@mui/icons-material/Clear";
import MapContainer from "./MapContainer";
import {
  searchLocation,
  reverseGeocode,
  GeocodingResult,
} from "@/lib/utils/geocoding";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Location } from "@/types/foodOutlet";

interface LocationPickerProps {
  value?: Location | null;
  onChange: (location: Location) => void;
  height?: number;
}

export default function LocationPicker({
  value,
  onChange,
  height = 300,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    location: userLocation,
    requestLocation,
    isLoading: isGettingLocation,
  } = useGeolocation();

  const mapCenter = value
    ? ([value.latitude, value.longitude] as [number, number])
    : userLocation
      ? ([userLocation.latitude, userLocation.longitude] as [number, number])
      : ([14.5995, 120.9842] as [number, number]); // Manila default

  const markerPosition = value
    ? ([value.latitude, value.longitude] as [number, number])
    : null;

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
      setShowResults(results.length > 0);
      setIsSearching(false);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setIsReverseGeocoding(true);
      const result = await reverseGeocode(lat, lng);
      setIsReverseGeocoding(false);

      onChange({
        latitude: lat,
        longitude: lng,
        address: result?.shortAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
      setSearchQuery("");
      setShowResults(false);
    },
    [onChange],
  );

  const handleSearchResultClick = useCallback(
    (result: GeocodingResult) => {
      onChange({
        latitude: result.latitude,
        longitude: result.longitude,
        address: result.shortAddress,
      });
      setSearchQuery("");
      setShowResults(false);
    },
    [onChange],
  );

  const handleUseCurrentLocation = useCallback(async () => {
    if (userLocation) {
      handleMapClick(userLocation.latitude, userLocation.longitude);
    } else {
      requestLocation();
    }
  }, [userLocation, handleMapClick, requestLocation]);

  // Auto-set location when user location becomes available
  useEffect(() => {
    if (userLocation && !value) {
      handleMapClick(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation, value, handleMapClick]);

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  {isSearching ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SearchIcon />
                  )}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchQuery("");
                        setShowResults(false);
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={handleUseCurrentLocation}
                    disabled={isGettingLocation}
                    color="primary"
                    title="Use current location"
                  >
                    {isGettingLocation ? (
                      <CircularProgress size={20} />
                    ) : (
                      <MyLocationIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          size="small"
        />

        {showResults && (
          <Paper
            sx={{
              position: "absolute",
              top: 56,
              left: 0,
              right: 0,
              zIndex: 1000,
              maxHeight: 200,
              overflow: "auto",
            }}
            elevation={3}
          >
            <List dense disablePadding>
              {searchResults.map((result, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <ListItemText
                      primary={result.shortAddress}
                      secondary={result.displayName}
                      secondaryTypographyProps={{
                        sx: {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      <Box sx={{ position: "relative" }}>
        <MapContainer
          center={mapCenter}
          zoom={value ? 16 : 13}
          markerPosition={markerPosition}
          onMapClick={handleMapClick}
          height={height}
        />
        {isReverseGeocoding && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "8px",
              zIndex: 500,
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}
      </Box>

      {value && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selected: {value.address}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

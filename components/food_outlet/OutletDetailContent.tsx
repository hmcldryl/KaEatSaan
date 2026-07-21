"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Button,
  Collapse,
  Avatar,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RateReviewIcon from "@mui/icons-material/RateReview";
import EditIcon from "@mui/icons-material/Edit";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import ChatIcon from "@mui/icons-material/Chat";
import HistoryIcon from "@mui/icons-material/History";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FoodOutlet, BudgetLevel } from "@/types/foodOutlet";
import { useReviews } from "@/hooks/useReviews";
import { useAuthStore } from "@/lib/store/authStore";
import { useUpdateLogs } from "@/hooks/useUpdateLogs";
import { formatDistance } from "@/lib/utils/distance";
import StarRating from "@/components/reviews/StarRating";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import MapContainer from "@/components/map/MapContainer";
import EditFoodOutletModal from "@/components/food_outlet/EditFoodOutletModal";
import { useLocationStore } from "@/lib/store/locationStore";
import { useFoodOutletStore } from "@/lib/store/foodOutletStore";
import { useUserProfileStore } from "@/lib/store/userProfileStore";

interface OutletDetailContentProps {
  outlet: FoodOutlet;
  active?: boolean;
  mapHeight?: number;
  showEdit?: boolean;
  showHistory?: boolean;
  headerPt?: number;
}

const BUDGET_SYMBOLS: Record<BudgetLevel, string> = {
  1: "₱", 2: "₱₱", 3: "₱₱₱", 4: "₱₱₱₱", 5: "₱₱₱₱₱",
};

const FIELD_LABELS: Record<string, string> = {
  name: "Name", classification: "Classification", cuisine: "Cuisine",
  budget: "Budget", isOpen: "Open status", location: "Location",
  description: "Description", tags: "Tags", contactNumber: "Contact number",
  facebookUrl: "Facebook", messengerUsername: "Messenger",
};

function formatLogDate(iso: string) {
  const d = new Date(iso);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatChangeVal(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (Array.isArray(val)) return val.join(", ") || "—";
  if (typeof val === "boolean") return val ? "Open" : "Closed";
  if (typeof val === "number") return "₱".repeat(val);
  if (typeof val === "object" && val !== null && "address" in val) return (val as { address: string }).address;
  return String(val);
}

export default function OutletDetailContent({
  outlet,
  active = true,
  mapHeight = 200,
  showEdit = true,
  showHistory = true,
  headerPt = 2.5,
}: OutletDetailContentProps) {
  const { user } = useAuthStore();
  const { location: userGeoLocation } = useLocationStore();
  const { outlets } = useFoodOutletStore();
  const { profile, addXP } = useUserProfileStore();
  const { reviews, isLoading: reviewsLoading, addReview, deleteReview, reviewCount, averageRating } = useReviews(
    active ? outlet.id : null,
  );
  const { logs, isLoading: logsLoading } = useUpdateLogs(active ? outlet.id : null);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const liveOutlet = outlets.find((o) => o.id === outlet.id) ?? outlet;

  const handleAddReview = async (rating: number, summary: string) => {
    if (!user) return;
    await addReview(outlet.id, user.uid, profile?.displayName || "Anonymous", user.photoURL || undefined, { rating, summary });
    addXP(user.uid, 5);
    setShowReviewForm(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId, outlet.id);
  };

  const userHasReviewed = reviews.some((r) => r.userId === user?.uid);

  return (
    <>
      {/* Header */}
      <Box sx={{ textAlign: "center", pt: headerPt, pb: 1.25, px: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#FF6B35", letterSpacing: "-0.02em", lineHeight: 1.2, mt: 1.5, mb: 1 }}>
          {liveOutlet.name}
        </Typography>
        {averageRating > 0 && (
          <Box sx={{ mb: 0.75, display: "flex", justifyContent: "center" }}>
            <StarRating value={averageRating} readonly size="small" showValue count={reviewCount} />
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", justifyContent: "center" }}>
          {liveOutlet.classification && <Chip label={liveOutlet.classification} size="small" sx={{ bgcolor: "#F3F4F6", color: "#374151", fontWeight: 600, fontSize: "0.72rem", height: 24 }} />}
          <Chip label={liveOutlet.cuisine} size="small" sx={{ bgcolor: "#FF6B35", color: "#fff", fontWeight: 600, fontSize: "0.72rem", height: 24 }} />
          <Chip label={BUDGET_SYMBOLS[liveOutlet.budget]} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: "0.72rem", height: 24, borderColor: "#E5E7EB" }} />
          {liveOutlet.distance !== undefined && (
            <Chip
              icon={<LocationOnIcon sx={{ fontSize: "14px !important" }} />}
              label={formatDistance(liveOutlet.distance)}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: "0.72rem", height: 24, borderColor: "#E5E7EB" }}
            />
          )}
        </Box>
      </Box>

      {/* Location link */}
      <Box
        component="a"
        href={`https://www.google.com/maps/dir/?api=1&destination=${liveOutlet.location.latitude},${liveOutlet.location.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 0.5, pt: 0, pb: 1, px: 2, textDecoration: "none",
          color: "#6B7280", borderBottom: "1px solid #F3F4F6",
          transition: "color 0.15s", "&:hover": { color: "#FF6B35" },
        }}
      >
        <Typography sx={{ fontSize: "0.72rem", lineHeight: 1.3, textAlign: "center" }}>
          {liveOutlet.location.address}
        </Typography>
      </Box>

      {/* Map */}
      <Box sx={{ height: mapHeight }}>
        <MapContainer
          center={[liveOutlet.location.latitude, liveOutlet.location.longitude]}
          zoom={16}
          markerPosition={[liveOutlet.location.latitude, liveOutlet.location.longitude]}
          height={mapHeight}
          borderRadius={0}
          userLocation={userGeoLocation ? [userGeoLocation.latitude, userGeoLocation.longitude] : undefined}
        />
      </Box>

      <Box sx={{ p: 1.5 }}>
        {/* Contact & Social */}
        {(liveOutlet.contactNumber || liveOutlet.facebookUrl || liveOutlet.messengerUsername) && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1, justifyContent: "center" }}>
            {liveOutlet.contactNumber && (
              <Link href={`tel:${liveOutlet.contactNumber}`} underline="none">
                <Chip icon={<PhoneIcon sx={{ fontSize: "13px !important" }} />} label={liveOutlet.contactNumber} size="small" variant="outlined" clickable sx={{ fontSize: "0.68rem", height: 22, borderColor: "#E5E7EB", color: "#374151" }} />
              </Link>
            )}
            {liveOutlet.facebookUrl && (
              <Link href={liveOutlet.facebookUrl} target="_blank" rel="noopener noreferrer" underline="none">
                <Chip icon={<FacebookIcon sx={{ fontSize: "13px !important", color: "#1877F2 !important" }} />} label="Facebook" size="small" variant="outlined" clickable sx={{ fontSize: "0.68rem", height: 22, borderColor: "#E5E7EB", color: "#374151" }} />
              </Link>
            )}
            {liveOutlet.messengerUsername && (
              <Link href={`https://m.me/${liveOutlet.messengerUsername}`} target="_blank" rel="noopener noreferrer" underline="none">
                <Chip icon={<ChatIcon sx={{ fontSize: "13px !important", color: "#0084FF !important" }} />} label="Message" size="small" variant="outlined" clickable sx={{ fontSize: "0.68rem", height: 22, borderColor: "#E5E7EB", color: "#374151" }} />
              </Link>
            )}
          </Box>
        )}

        {liveOutlet.description && (
          <Box sx={{ mb: 1, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.72rem", lineHeight: 1.3 }} color="text.secondary">{liveOutlet.description}</Typography>
          </Box>
        )}

        {liveOutlet.tags && liveOutlet.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1, justifyContent: "center" }}>
            {liveOutlet.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: "0.68rem", height: 20 }} />
            ))}
          </Box>
        )}

        {user && showEdit && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon sx={{ fontSize: "13px !important" }} />}
              onClick={() => setShowEditModal(true)}
              sx={{ fontSize: "0.68rem", borderRadius: "9999px", fontWeight: 700, borderColor: "#E5E7EB", color: "#6B7280", borderWidth: 1.5, "&:hover": { borderWidth: 1.5 } }}
            >
              Edit details
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography fontWeight={700} sx={{ fontSize: "0.82rem" }}>Reviews ({reviewCount})</Typography>
          {user && !userHasReviewed && !showReviewForm && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<RateReviewIcon sx={{ fontSize: "14px !important" }} />}
              onClick={() => setShowReviewForm(true)}
              sx={{ fontSize: "0.72rem", borderRadius: "9999px", fontWeight: 700, borderColor: "#E5E7EB", color: "#FF6B35", borderWidth: 1.5, "&:hover": { borderWidth: 1.5, borderColor: "rgba(255,107,53,0.4)" } }}
            >
              Write Review
            </Button>
          )}
        </Box>

        <Collapse in={showReviewForm}>
          <Box sx={{ mb: 1.5, p: 1.5, bgcolor: "#F9FAFB", borderRadius: 2 }}>
            <ReviewForm onSubmit={handleAddReview} onCancel={() => setShowReviewForm(false)} />
          </Box>
        </Collapse>

        <ReviewList reviews={reviews} isLoading={reviewsLoading} onDelete={handleDeleteReview} currentUserName={profile?.displayName || undefined} />

        {showHistory && <Divider sx={{ my: 1 }} />}
        {showHistory && <Accordion disableGutters elevation={0} sx={{ bgcolor: "transparent", "&:before": { display: "none" } }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: "16px", color: "#9CA3AF" }} />}
            sx={{ p: 0, minHeight: 0, "& .MuiAccordionSummary-content": { m: 0 } }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <HistoryIcon sx={{ fontSize: "13px", color: "#9CA3AF" }} />
              <Typography sx={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600 }}>
                Edit history{logs.length > 0 ? ` (${logs.length})` : ""}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pt: 1 }}>
            {logsLoading ? (
              <Typography sx={{ fontSize: "0.68rem", color: "#9CA3AF" }}>Loading…</Typography>
            ) : logs.length === 0 ? (
              <Typography sx={{ fontSize: "0.68rem", color: "#9CA3AF" }}>No edits yet.</Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {logs.map((log) => (
                  <Box key={log.id} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                    <Avatar src={log.userPhotoUrl} sx={{ width: 22, height: 22, fontSize: "0.6rem", bgcolor: "#FF6B35", flexShrink: 0 }}>
                      {(log.userId === user?.uid && profile?.displayName ? profile.displayName : log.userName)[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151" }}>
                          {log.userId === user?.uid && profile?.displayName ? profile.displayName : log.userName}
                        </Typography>
                        <Typography sx={{ fontSize: "0.62rem", color: "#9CA3AF" }}>· {formatLogDate(log.timestamp)}</Typography>
                      </Box>
                      {Object.entries(log.changes).map(([field, change]) => (
                        <Typography key={field} sx={{ fontSize: "0.62rem", color: "#6B7280", lineHeight: 1.4 }}>
                          <strong>{FIELD_LABELS[field] || field}:</strong>{" "}
                          {formatChangeVal(change.from)} → {formatChangeVal(change.to)}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>}
      </Box>

      {showEditModal && (
        <EditFoodOutletModal
          outlet={liveOutlet}
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}

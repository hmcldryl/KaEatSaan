export interface Review {
  id: string;
  outletId: string;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  rating: number; // 1-5
  summary: string;
  createdAt: string; // ISO date string
}

export interface ReviewFormData {
  rating: number;
  summary: string;
}

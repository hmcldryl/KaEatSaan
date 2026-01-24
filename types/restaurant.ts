export type CuisineType =
  | 'Filipino'
  | 'Japanese'
  | 'Korean'
  | 'Italian'
  | 'Chinese'
  | 'American'
  | 'Thai'
  | 'Vietnamese'
  | 'Mexican'
  | 'Indian'
  | 'Fast Food'
  | 'Other';

export type BudgetLevel = 1 | 2 | 3 | 4; // ₱ to ₱₱₱₱

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: CuisineType;
  budget: BudgetLevel;
  location: Location;
  distance?: number;  // Calculated distance from user in km
  rating?: number;
  imageUrl?: string;
  isOpen?: boolean;
  description?: string;
  tags?: string[];
  createdAt: string;  // ISO date string
  createdBy?: string; // User ID who added the restaurant
  updatedAt?: string; // ISO date string
}

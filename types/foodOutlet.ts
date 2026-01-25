// Classification - Type of establishment
export type ClassificationType =
  | "Restaurant"
  | "Fast Food"
  | "Cafe"
  | "Coffee Shop"
  | "Bakery"
  | "Pizza Parlor"
  | "Noodle House"
  | "Ramen Shop"
  | "Gelato Bar"
  | "Ice Cream Shop"
  | "Donut Shop"
  | "Food Stall"
  | "Food Truck"
  | "Bar & Grill"
  | "Buffet"
  | "Diner"
  | "Other";

// Cuisine - Theme/Origin of food
export type CuisineType =
  | "Filipino"
  | "Japanese"
  | "Korean"
  | "Italian"
  | "Chinese"
  | "American"
  | "Thai"
  | "Vietnamese"
  | "Mexican"
  | "Indian"
  | "Spanish"
  | "French"
  | "Mediterranean"
  | "Middle Eastern"
  | "Fusion"
  | "International"
  | "Other";

export type BudgetLevel = 1 | 2 | 3 | 4 | 5; // ₱ to ₱₱₱₱₱

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface FoodOutlet {
  id: string;
  name: string;
  classification: ClassificationType;
  cuisine: CuisineType;
  budget: BudgetLevel;
  location: Location;
  distance?: number; // Calculated distance from user in km
  rating?: number;
  imageUrl?: string;
  isOpen?: boolean;
  description?: string;
  tags?: string[];
  createdAt: string; // ISO date string
  createdBy?: string; // User ID who added the food outlet
  updatedAt?: string; // ISO date string
  reviewCount?: number; // Total number of reviews
  averageRating?: number; // Calculated average rating (1-5)
}

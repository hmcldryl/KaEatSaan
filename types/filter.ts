import { CuisineType, BudgetLevel } from './restaurant';

export interface FilterState {
  budget: [BudgetLevel, BudgetLevel];  // Min, max
  distance: number;  // kilometers
  cuisines: CuisineType[];
  includeClosedRestaurants: boolean;
  onlyNewPlaces: boolean;
  maxRestaurants: number;  // Max restaurants to show in wheel (5-20)
}

export interface ActiveFilter {
  type: 'budget' | 'distance' | 'cuisine';
  label: string;
  value: string;
}

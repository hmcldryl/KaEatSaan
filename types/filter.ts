import { CuisineType, BudgetLevel } from './restaurant';

export interface FilterState {
  budget: [BudgetLevel, BudgetLevel];  // Min, max
  distance: number;  // kilometers
  cuisines: CuisineType[];
  includeClosedRestaurants: boolean;
  onlyNewPlaces: boolean;
}

export interface ActiveFilter {
  type: 'budget' | 'distance' | 'cuisine';
  label: string;
  value: string;
}

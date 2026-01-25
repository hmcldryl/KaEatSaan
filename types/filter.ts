import { CuisineType, ClassificationType, BudgetLevel } from './foodOutlet';

export interface FilterState {
  budget: [BudgetLevel, BudgetLevel];  // Min, max
  distance: number;  // kilometers
  classifications: ClassificationType[];
  cuisines: CuisineType[];
  includeClosedOutlets: boolean;
  onlyNewPlaces: boolean;
  maxOutlets: number;  // Max food outlets to show in wheel (5-20)
}

export interface ActiveFilter {
  type: 'budget' | 'distance' | 'classification' | 'cuisine';
  label: string;
  value: string;
}

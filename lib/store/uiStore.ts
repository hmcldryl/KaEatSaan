import { create } from 'zustand';

interface UIStore {
  spinTrigger: number; // Increment to trigger spin
  isSpinning: boolean;
  filtersModalOpen: boolean;

  // Actions
  triggerSpin: () => void;
  setIsSpinning: (spinning: boolean) => void;
  setFiltersModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  spinTrigger: 0,
  isSpinning: false,
  filtersModalOpen: false,

  triggerSpin: () => {
    set((state) => ({ spinTrigger: state.spinTrigger + 1 }));
  },

  setIsSpinning: (spinning: boolean) => {
    set({ isSpinning: spinning });
  },

  setFiltersModalOpen: (open: boolean) => {
    set({ filtersModalOpen: open });
  },
}));

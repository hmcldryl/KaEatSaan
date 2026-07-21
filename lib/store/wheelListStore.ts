import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WheelListStore {
  customOrder: string[] | null;
  excluded: string[];
  setOrder: (ids: string[]) => void;
  toggleExclude: (id: string) => void;
  reset: () => void;
}

export const useWheelListStore = create<WheelListStore>()(
  persist(
    (set) => ({
      customOrder: null,
      excluded: [],
      setOrder: (ids) => set({ customOrder: ids }),
      toggleExclude: (id) =>
        set((s) => ({
          excluded: s.excluded.includes(id)
            ? s.excluded.filter((e) => e !== id)
            : [...s.excluded, id],
        })),
      reset: () => set({ customOrder: null, excluded: [] }),
    }),
    { name: 'kaeatsaan-wheel-list' }
  )
);

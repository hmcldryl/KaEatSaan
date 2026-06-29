import { create } from 'zustand';
import { ref, onValue, off, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { UserProfile } from '@/types/userProfile';

interface UserProfileStore {
  profile: UserProfile | null;
  isLoading: boolean;
  listen: (uid: string) => () => void;
  stopListening: (uid: string) => void;
  syncSpin: (uid: string) => Promise<void>;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  profile: null,
  isLoading: false,

  listen: (uid: string) => {
    set({ isLoading: true });
    const profileRef = ref(database, `users/${uid}`);
    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      set({
        profile: data
          ? { uid, ...data }
          : { uid, spinCount: 0, level: 1, streak: 0, lastSpinDate: '' },
        isLoading: false,
      });
    });
    return () => off(profileRef);
  },

  stopListening: (uid: string) => {
    off(ref(database, `users/${uid}`));
    set({ profile: null });
  },

  syncSpin: async (uid: string) => {
    const { profile } = get();
    const today = todayStr();
    const yesterday = yesterdayStr();

    const prevStreak = profile?.streak || 0;
    const prevLast = profile?.lastSpinDate || '';
    const prevCount = profile?.spinCount || 0;

    const newCount = prevCount + 1;
    const newStreak =
      prevLast === today ? prevStreak :
      prevLast === yesterday ? prevStreak + 1 : 1;
    const newLevel = Math.floor(newCount / 5) + 1;

    await update(ref(database, `users/${uid}`), {
      spinCount: newCount,
      streak: newStreak,
      level: newLevel,
      lastSpinDate: today,
    });
  },
}));

import { create } from 'zustand';
import { ref, onValue, off, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { UserProfile } from '@/types/userProfile';
import { useXPNotifStore } from '@/lib/store/xpNotifStore';

interface UserProfileStore {
  profile: UserProfile | null;
  isLoading: boolean;
  listen: (uid: string) => () => void;
  stopListening: (uid: string) => void;
  syncSpin: (uid: string) => Promise<void>;
  addXP: (uid: string, points: number) => Promise<void>;
  setDisplayName: (uid: string, name: string) => Promise<void>;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function xpToLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
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
          ? { uid, xp: 0, ...data }
          : { uid, spinCount: 0, level: 1, streak: 0, lastSpinDate: '', xp: 0 },
        isLoading: false,
      });
    });
    return () => off(profileRef);
  },

  stopListening: (uid: string) => {
    off(ref(database, `users/${uid}`));
    set({ profile: null });
  },

  setDisplayName: async (uid: string, name: string) => {
    await update(ref(database, `users/${uid}`), { displayName: name.trim() || null });
  },

  addXP: async (uid: string, points: number) => {
    useXPNotifStore.getState().push(points);
    const { profile } = get();
    const newXp = (profile?.xp ?? 0) + points;
    const newLevel = xpToLevel(newXp);
    await update(ref(database, `users/${uid}`), { xp: newXp, level: newLevel });
  },

  syncSpin: async (uid: string) => {
    const { profile } = get();
    const today = todayStr();
    const yesterday = yesterdayStr();

    const prevStreak = profile?.streak || 0;
    const prevLast = profile?.lastSpinDate || '';
    const prevCount = profile?.spinCount || 0;
    const prevXp = profile?.xp ?? 0;

    const newCount = prevCount + 1;
    const newStreak =
      prevLast === today ? prevStreak :
      prevLast === yesterday ? prevStreak + 1 : 1;
    useXPNotifStore.getState().push(2);
    const newXp = prevXp + 2;
    const newLevel = xpToLevel(newXp);

    await update(ref(database, `users/${uid}`), {
      spinCount: newCount,
      streak: newStreak,
      level: newLevel,
      lastSpinDate: today,
      xp: newXp,
    });
  },
}));

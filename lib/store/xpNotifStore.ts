import { create } from "zustand";
import { getLastCursor } from "@/lib/cursorTracker";

export interface XPNotif {
  id: number;
  amount: number;
  x: number;
  y: number;
}

let _id = 0;

interface XPNotifState {
  notifs: XPNotif[];
  push: (amount: number) => void;
  remove: (id: number) => void;
}

export const useXPNotifStore = create<XPNotifState>((set) => ({
  notifs: [],
  push: (amount) => {
    const id = ++_id;
    const { x, y } = getLastCursor();
    set((s) => ({ notifs: [...s.notifs, { id, amount, x, y }] }));
  },
  remove: (id) => set((s) => ({ notifs: s.notifs.filter((n) => n.id !== id) })),
}));

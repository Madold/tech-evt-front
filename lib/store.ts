import { create } from 'zustand';
import { User, Event } from '@/types';

interface AppState {
  user: User | null;
  events: Event[];
  setUser: (user: User | null) => void;
  setEvents: (events: Event[]) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  events: [],
  setUser: (user) => set({ user }),
  setEvents: (events) => set({ events }),
}));

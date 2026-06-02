import { create } from 'zustand';

interface CafeInfo {
  name: string;
  vicinity: string;
  rating?: number;
  place_id: string;
  geometry: { location: { lat: number; lng: number } };
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  } | null;
  photo_url?: string | null;
  phone?: string | null;
}

interface CafeStore {
  cafe: CafeInfo | null;
  distance: string;
  setCafe: (cafe: CafeInfo | null, distance?: string) => void;
}

export const useCafeStore = create<CafeStore>((set) => ({
  cafe: null,
  distance: '',
  setCafe: (cafe, distance) => set({ cafe, distance: distance || '' }),
}));

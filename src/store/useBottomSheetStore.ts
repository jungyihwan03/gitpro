// src/store/useBottomSheetStore.ts
import { create } from 'zustand';

interface BottomSheetState {
  isRecordSheetVisible: boolean;
  openRecordSheet: () => void;
  closeRecordSheet: () => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  isRecordSheetVisible: false,
  openRecordSheet: () => {
    console.log("🌟 바텀시트 열기 버튼 눌림!"); // 👈 이 줄을 추가하세요!
    set({ isRecordSheetVisible: true });
  },
  closeRecordSheet: () => set({ isRecordSheetVisible: false }),
}));
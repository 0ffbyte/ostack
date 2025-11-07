import { create } from "zustand";

type AppStore = {
  bears: number;
  increasePopulation: () => void;
};

const useAppStore = create<AppStore>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
}));

export default useAppStore;

import { create } from "zustand";

type AppStore = {
  alert: {
    title: string;
    message: string;
    timestamp: number;
  } | null;
  setAlert: ({ title, message }: { title: string; message: string }) => void;
};

const useAppStore = create<AppStore>((set) => ({
  alert: null,
  setAlert: ({ title, message }) =>
    set({
      alert: {
        title,
        message,
        timestamp: new Date().getTime(),
      },
    }),
}));

export default useAppStore;

import { create } from "zustand";

interface DoctorStore {
  currentTab: number;
}

interface DoctorActions {
  setCurrentTab: (newCurrentTab: number) => void;
}

type DoctorState = DoctorStore & DoctorActions;

const defaultValues: DoctorStore = {
  currentTab: 1,
};

const useDoctorStore = create<DoctorState>((set) => ({
  ...defaultValues,
  setCurrentTab: (newCurrentTab) => set({ currentTab: newCurrentTab }),
}));

export default useDoctorStore;
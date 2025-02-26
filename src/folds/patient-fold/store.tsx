import { create } from "zustand";

interface PatientStore {
  currentTab: number;
}

interface PatientActions {
  setCurrentTab: (newCurrentTab: number) => void;
}

type PatientState = PatientStore & PatientActions;

const defaultValues: PatientStore = {
  currentTab: 1,
};

const usePatientStore = create<PatientState>((set) => ({
  ...defaultValues,
  setCurrentTab: (newCurrentTab) => set({ currentTab: newCurrentTab }),
}));

export default usePatientStore;
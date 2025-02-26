import { create } from "zustand";

interface RegisterStore {
  step: number;

  // step 1
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  birthDate: string | null;
  seggs: number | null;
  homeAddress: string | null;

  // step 2
  username: string | null;
  password: string | null;
  contactNumber: string | null;
  emailAddress: string | null;
}

interface RegisterActions {
  goToNextStep: () => void;
  goToPrevStep: () => void;
  resetValues: () => void;

  // step 1
  setFirstName: (newFirstName: string) => void;
  setMiddleName: (newMiddleName: string) => void;
  setLastName: (newLastName: string) => void;
  setBirthDate: (newBirthDate: string) => void;
  setSeggs: (newSeggs: number) => void;
  setHomeAddress: (newHomeAddress: string) => void;

  // step 2
  setUsername: (newUsername: string) => void;
  setPassword: (newPassword: string) => void;
  setContactNumber: (newContactNumber: string) => void;
  setEmailAddress: (newEmailAddress: string) => void;
}

type RegisterState = RegisterStore & RegisterActions;

const defaultValues: RegisterStore = {
  step: 1,

  // step 1
  firstName: null,
  middleName: null,
  lastName: null,
  birthDate: null,
  seggs: null,
  homeAddress: null,

  // step 2
  username: null,
  password: null,
  contactNumber: null,
  emailAddress: null,
};

const useRegisterStore = create<RegisterState>((set) => ({
  ...defaultValues,

  goToNextStep: () => {
    set((state) => {
      if (state.step < 2) {
        return { step: state.step + 1 };
      } else {
        console.error("Cannot go to next step");
        return state;
      }
    });
  },

  goToPrevStep: () => {
    set((state) => {
      if (state.step > 1) {
        return { step: state.step - 1 };
      } else {
        console.error("Cannot go to previous step");
        return state;
      }
    });
  },

  resetValues: () => set({ ...defaultValues }),

  // step 1
  setFirstName: (newFirstName) => set({ firstName: newFirstName }),
  setMiddleName: (newMiddleName) => set({ middleName: newMiddleName }),
  setLastName: (newLastName) => set({ lastName: newLastName }),
  setBirthDate: (newBirthDate) => set({ birthDate: newBirthDate }),
  setSeggs: (newSeggs) => set({ seggs: newSeggs }),
  setHomeAddress: (newHomeAddress) => set({ homeAddress: newHomeAddress }),

  // step 2
  setUsername: (newUsername) => set({ username: newUsername }),
  setPassword: (newPassword) => set({ password: newPassword }),
  setContactNumber: (newContactNumber) =>
    set({ contactNumber: newContactNumber }),
  setEmailAddress: (newEmailAddress) => set({ emailAddress: newEmailAddress }),
}));

export default useRegisterStore;

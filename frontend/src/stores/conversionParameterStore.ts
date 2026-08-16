import { create } from "zustand";

type ConversionParameters = {
  inputFiles: string[];
  inputFolder: string;
  useLRF: boolean;
  setInputFiles: (inputFiles: string[]) => void;
  setUseLRF: (useLRF: boolean) => void;
};

export const useConversionParametersStore = create<ConversionParameters>((set) => ({
  inputFiles: [],
  inputFolder: "",
  useLRF: false,
  setInputFiles: (inputFiles) => set({ inputFiles }),
  setUseLRF: (useLRF) => set({ useLRF }),
}));

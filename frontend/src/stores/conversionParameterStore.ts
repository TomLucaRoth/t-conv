import { create } from "zustand";

type ConversionParameters = {
  inputFiles: string[];
  outputFolder: string;
  useLRF: boolean;
  setInputFiles: (inputFiles: string[]) => void;
  setOutputFolder: (outputFolder: string) => void;
  setUseLRF: (useLRF: boolean) => void;
};

export const useConversionParametersStore = create<ConversionParameters>((set) => ({
  inputFiles: [],
  outputFolder: "",
  useLRF: false,
  setInputFiles: (inputFiles) => set({ inputFiles }),
  setOutputFolder: (outputFolder) => set({ outputFolder }),
  setUseLRF: (useLRF) => set({ useLRF }),
}));

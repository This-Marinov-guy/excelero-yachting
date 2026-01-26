import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Helper functions for localStorage
const STORAGE_KEY = "boat_upload_form_data";

const loadFromStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

const saveToStorage = (state: BoatUploadState) => {
  if (typeof window === "undefined") return;
  try {
    // Don't store File objects, only metadata
    const dataToStore = {
      formData: state.formData,
      imageMetadata: state.imageMetadata,
      mainImageIndex: state.mainImageIndex,
      brochureFileName: state.brochureFileName,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export interface ImageMetadata {
  name: string;
  size: number;
  type: string;
  order: number;
}

export interface BoatUploadState {
  formData: {
    dealer_id: string;
    title: string;
    manufacturer: string;
    build_number: string;
    build_year: string;
    location: string;
    price: string;
    vat_included: boolean;
    dealer: string;
    description: string;
    designer: string;
    hull_length: string;
    waterline_length: string;
    beam: string;
    draft: string;
    ballast: string;
    displacement: string;
    engine_power: string;
    fuel_tank: string;
    water_tank: string;
    exterior_description: string;
  };
  imageMetadata: ImageMetadata[];
  mainImageIndex: number;
  brochureFileName: string | null;
}

const storedData = loadFromStorage();

const initialState: BoatUploadState = storedData || {
  formData: {
    dealer_id: "",
    title: "",
    manufacturer: "",
    build_number: "",
    build_year: "",
    location: "",
    price: "",
    vat_included: true,
    dealer: "",
    description: "",
    designer: "",
    hull_length: "",
    waterline_length: "",
    beam: "",
    draft: "",
    ballast: "",
    displacement: "",
    engine_power: "",
    fuel_tank: "",
    water_tank: "",
    exterior_description: "",
  },
  imageMetadata: [],
  mainImageIndex: 0,
  brochureFileName: null,
};

const BoatUploadSlice = createSlice({
  name: "boatUpload",
  initialState,
  reducers: {
    updateFormField: (
      state,
      action: PayloadAction<{ field: keyof BoatUploadState["formData"]; value: string | boolean }>
    ) => {
      (state.formData[action.payload.field] as any) = action.payload.value;
      saveToStorage(state);
    },
    updateFormData: (state, action: PayloadAction<Partial<BoatUploadState["formData"]>>) => {
      state.formData = { ...state.formData, ...action.payload };
      saveToStorage(state);
    },
    setImageMetadata: (state, action: PayloadAction<ImageMetadata[]>) => {
      state.imageMetadata = action.payload;
      saveToStorage(state);
    },
    addImageMetadata: (state, action: PayloadAction<ImageMetadata>) => {
      state.imageMetadata.push(action.payload);
      // Sort by order
      state.imageMetadata.sort((a, b) => a.order - b.order);
      saveToStorage(state);
    },
    removeImageMetadata: (state, action: PayloadAction<number>) => {
      state.imageMetadata.splice(action.payload, 1);
      // Reorder remaining images
      state.imageMetadata.forEach((img, index) => {
        img.order = index;
      });
      // Adjust main image index if needed
      if (state.mainImageIndex === action.payload && state.imageMetadata.length > 0) {
        state.mainImageIndex = 0;
      } else if (state.mainImageIndex > action.payload) {
        state.mainImageIndex = state.mainImageIndex - 1;
      }
      saveToStorage(state);
    },
    reorderImages: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.imageMetadata.splice(fromIndex, 1);
      state.imageMetadata.splice(toIndex, 0, moved);
      // Update order values
      state.imageMetadata.forEach((img, index) => {
        img.order = index;
      });
      // Update main image index if needed
      if (state.mainImageIndex === fromIndex) {
        state.mainImageIndex = toIndex;
      } else if (state.mainImageIndex === toIndex) {
        state.mainImageIndex = fromIndex;
      } else if (fromIndex < state.mainImageIndex && toIndex >= state.mainImageIndex) {
        state.mainImageIndex = state.mainImageIndex - 1;
      } else if (fromIndex > state.mainImageIndex && toIndex <= state.mainImageIndex) {
        state.mainImageIndex = state.mainImageIndex + 1;
      }
      saveToStorage(state);
    },
    setMainImageIndex: (state, action: PayloadAction<number>) => {
      state.mainImageIndex = action.payload;
      saveToStorage(state);
    },
    setBrochureFileName: (state, action: PayloadAction<string | null>) => {
      state.brochureFileName = action.payload;
      saveToStorage(state);
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.imageMetadata = [];
      state.mainImageIndex = 0;
      state.brochureFileName = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const {
  updateFormField,
  updateFormData,
  setImageMetadata,
  addImageMetadata,
  removeImageMetadata,
  reorderImages,
  setMainImageIndex,
  setBrochureFileName,
  resetForm,
} = BoatUploadSlice.actions;

export default BoatUploadSlice.reducer;

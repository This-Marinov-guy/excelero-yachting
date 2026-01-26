import { configureStore } from "@reduxjs/toolkit";
import LayoutReducers from "@/redux/reducers/LayoutSlice";
import ProductReducers from "@/redux/reducers/ProductSlice";
import FiltersSlice from "@/redux/reducers/FilterSlice";
import BoatUploadReducer from "@/redux/reducers/BoatUploadSlice";

export const store = configureStore({
  reducer: {
    layout: LayoutReducers,
    product: ProductReducers,
    filter: FiltersSlice,
    boatUpload: BoatUploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

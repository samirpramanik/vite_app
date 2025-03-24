import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theming/themeSlice.ts";

const store = configureStore({
  reducer: {
    themes: themeReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;

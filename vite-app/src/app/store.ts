import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theming/themeSlice.ts";
import postReducer from "../features/posts/postSlice.ts";

const store = configureStore({
  reducer: {
    themes: themeReducer,
    posts: postReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;

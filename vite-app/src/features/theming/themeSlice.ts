import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setLight: (state) => {
      state.theme = "light";
    },
    setDark: (state) => {
      state.theme = "dark";
    },
  },
});

export default themeSlice.reducer;
export const themeActions = themeSlice.actions;

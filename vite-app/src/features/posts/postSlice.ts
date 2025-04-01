import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

const initialState = {
  page: 1,
  post: [],
  error: "",
  loading: false,
  hasMore: false,
};

interface stateType {
  posts: {
    page: number;
    post: [];
    error: { message: string };
    loading: boolean;
    hasMore: boolean;
  };
  themes: {};
}

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (arg, { getState }) => {
    const state = <stateType>getState();
    console.log("state ::", state);
    let url = `${API_URL}?_page=${state.posts.page}&_limit=20`;
    console.log("URL formed :: ", url);
    const response = await axios.get(url);
    return response.data;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    incrementPage: (state) => {
      console.log("inside incrementPage action before :: ", state.page);
      state.page += 1;
      console.log("inside incrementPage action after :: ", state.page);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      console.log("inside pending action");
      state.loading = true;
      state.hasMore = false;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      console.log("inside fulfilled action");
      state.loading = false;
      state.error = "";
      if (action.payload.length > 0) {
        console.log("about to set data");
        state.post = state.post.concat(action.payload);
      }
      state.hasMore = action.payload.length > 0 ? true : false;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      console.log("inside rejected action");
      state.loading = false;
      state.post = [];
      state.error = action.error?.message as string;
    });
  },
});

export default postSlice.reducer;
export const postActions = postSlice.actions;

import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage on startup
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialState = {
  isAuthenticated: !!storedToken,
  user: storedUser || null,
  token: storedToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;

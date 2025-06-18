import { createSlice } from "@reduxjs/toolkit";

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
    login: (state, action) => {
      const { user, token } = action.payload;
      state.user = { ...user, role: user.role?.toLowerCase() }; // normalize role
      state.token = token;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

// ✅ export named actions
export const { login, logOut } = authSlice.actions;
export default authSlice.reducer;

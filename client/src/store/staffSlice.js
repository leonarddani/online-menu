// src/store/staffSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch staff from API
export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/employees/staff`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || "Failed to fetch staff");
      }
      const data = await res.json();
      return data.data; // Assuming API returns { data: [...] }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staffList: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateStaff: (state, action) => {
      const updatedStaff = action.payload;
      const index = state.staffList.findIndex(s => s.id === updatedStaff.id);
      if (index !== -1) {
        state.staffList[index] = updatedStaff;
      }
    },
    removeStaff: (state, action) => {
      const id = action.payload;
      state.staffList = state.staffList.filter(s => s.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch staff";
      });
  },
});

export const { updateStaff, removeStaff } = staffSlice.actions;

export default staffSlice.reducer;

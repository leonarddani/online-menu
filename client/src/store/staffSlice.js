// src/store/staffSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch all staff
export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (token, { rejectWithValue }) => {
    try {
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
    addStaff: (state, action) => {
      state.staffList.push(action.payload);
    },
    updateStaff: (state, action) => {
      const updatedStaff = action.payload;
      const index = state.staffList.findIndex((s) => s.id === updatedStaff.id);
      if (index !== -1) {
        state.staffList[index] = updatedStaff;
      }
    },
    removeStaff: (state, action) => {
      state.staffList = state.staffList.filter((s) => s.id !== action.payload);
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

export const { addStaff, updateStaff, removeStaff } = staffSlice.actions;

export default staffSlice.reducer;

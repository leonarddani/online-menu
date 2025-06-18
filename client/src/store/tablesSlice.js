// src/store/tablesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunks
export const fetchTables = createAsyncThunk(
  "tables/fetchTables",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch tables");
      const data = await response.json();
      return data.tables.map((table) => ({
        id: table.id.toString(),
        number: table.table_number.toString(),
        roomId: table.room_id?.toString() || "1",
        capacity: table.capacity,
        status: table.status,
        guestsSeated: table.guests_seated || 0,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const seatGuests = createAsyncThunk(
  "tables/seatGuests",
  async ({ tableId, userId, guests }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables/${tableId}/seat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, guests_seated: guests }),
      });
      if (!response.ok) throw new Error("Failed to seat guests");
      return { tableId, guests };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const freeTable = createAsyncThunk(
  "tables/freeTable",
  async (tableId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables/${tableId}/free`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to free table");
      return tableId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTable = createAsyncThunk(
  "tables/deleteTable",
  async (tableId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables/${tableId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete table");
      return tableId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const tablesSlice = createSlice({
  name: "tables",
  initialState: {
    tables: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(seatGuests.fulfilled, (state, action) => {
        const { tableId, guests } = action.payload;
        const table = state.tables.find((t) => t.id === tableId);
        if (table) {
          table.status = "occupied";
          table.guestsSeated = guests;
        }
      })
      .addCase(freeTable.fulfilled, (state, action) => {
        const tableId = action.payload;
        const table = state.tables.find((t) => t.id === tableId);
        if (table) {
          table.status = "available";
          table.guestsSeated = 0;
        }
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        const tableId = action.payload;
        state.tables = state.tables.filter((t) => t.id !== tableId);
      });
  },
});

export default tablesSlice.reducer;

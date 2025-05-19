import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch tables from API
export const fetchTables = createAsyncThunk("tables/fetchTables", async () => {
  try {
    const response = await fetch("http://localhost:8095/api/tables");

    if (!response.ok) {
      throw new Error("Failed to fetch tables");
    }

    const data = await response.json();

    // Log the response to check its structure
    console.log("Fetched tables:", data);

    // Ensure the response is an array
    if (Array.isArray(data)) {
      return data;
    } else {
      throw new Error("Received data is not an array");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// Update table status
export const updateTableStatus = createAsyncThunk(
  "tables/updateTableStatus",
  async ({ id, status }) => {
    try {
      const response = await fetch(`http://localhost:8095/api/tables/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update table status for table ${id}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
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
        state.error = null;  // Reset error when starting a new fetch
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
        state.error = null;  // Clear any previous errors after successful fetch
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTableStatus.fulfilled, (state, action) => {
        const index = state.tables.findIndex((table) => table.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
      })
      .addCase(updateTableStatus.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default tablesSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tablesReducer from "./tablesSlice";
import staffReducer from "./staffSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        tables: tablesReducer,
        staff: staffReducer,
    }
})
export default store;
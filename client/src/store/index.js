import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tablesReducer from "./tablesSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        tables: tablesReducer,
    }
})
export default store;
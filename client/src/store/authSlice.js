import {createSlice} from "@reduxjs/toolkit";
import { LogOut } from "lucide-react";
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token")
const initialState = {
    isAuthenticated: !! storedToken,
    user: storedUser || null,
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload
    },
    logOut: (state) => {
        state.isAuthenticated = false;
        state.user = null;
    }
    }
})
export const {login, logOut} = authSlice.actions;
export default authSlice.reducer;
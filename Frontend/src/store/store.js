import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import accessTokenSlice from "./accessTokenSlice";

const store = configureStore({
    reducer: {
        authSlice,
        accessTokenSlice
    }
})

export {store}
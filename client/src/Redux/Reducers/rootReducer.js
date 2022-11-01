import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer";

export const rootReducer = combineReducers({
 // reducers go here
 auth: authReducer
});
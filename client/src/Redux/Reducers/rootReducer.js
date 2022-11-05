import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer";
import { jobReducer } from "./jobReducer";

export const rootReducer = combineReducers({
 // reducers go here
 auth: authReducer,
 job: jobReducer
});
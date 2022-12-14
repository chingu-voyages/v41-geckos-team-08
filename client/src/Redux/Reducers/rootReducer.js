import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer";
import { jobReducer } from "./jobReducer";
import { proposalReducer } from "./proposalReducer";
import { RESET_STORE } from '../ActionTypes';

// to combine all reducers together
const appReducer = combineReducers({
 // reducers go here
 auth: authReducer,
 jobs: jobReducer,
 proposals: proposalReducer
});

// reset the state of a redux store
export const rootReducer = (state, action) => {
    if (action.type === RESET_STORE) {
      state = undefined;
    }
    return appReducer(state, action);
}
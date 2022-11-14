import { CREATE_JOB_PROPOSAL } from "../ActionTypes";

export const proposalReducer = (state = [], action) => {
 switch (action.type) {
  case CREATE_JOB_PROPOSAL:
   return [...state, action.payload];
  default:
   return state;
 }
}
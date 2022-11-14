import { CREATE_JOB_PROPOSAL, GET_PROPOSALS } from "../ActionTypes";

export const proposalReducer = (state = [], action) => {
 switch (action.type) {
  case CREATE_JOB_PROPOSAL:
   return [...state, action.payload];
  case GET_PROPOSALS:
   return action.payload;
  default:
   return state;
 }
}
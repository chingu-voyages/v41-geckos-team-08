import { CREATE_JOB_PROPOSAL, GET_PROPOSALS } from "../ActionTypes";

export const proposalReducer = (state = [], action) => {

 let jobs_taken, jobs_pending;

 switch (action.type) {
  case CREATE_JOB_PROPOSAL:
   return [...state, action.payload];
  case GET_PROPOSALS:
   jobs_taken = action.payload.filter(job => job.is_accepted === true);
   jobs_pending = action.payload.filter(job => job.is_accepted === null);
   return [{ jobs_taken, jobs_pending }];
  default:
   return state;
 }
}
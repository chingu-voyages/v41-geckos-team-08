import { CREATE_JOB_PROPOSAL, GET_PROPOSALS } from "../ActionTypes";

export const proposalReducer = (state = [], action) => {

 let jobs_taken, jobs_pending;

 switch (action.type) {
  case CREATE_JOB_PROPOSAL:
   jobs_taken = state[0].jobs_taken;
   jobs_pending = [action.payload, ...state[0].jobs_pending];
   return [{ jobs_taken, jobs_pending }];
  case GET_PROPOSALS:
   jobs_taken = action.payload.filter(job => job.is_accepted === true && job.job.is_completed === false);
   jobs_pending = action.payload.filter(job => job.is_accepted === null);
   return [{ jobs_taken, jobs_pending }];
  default:
   return state;
 }
}
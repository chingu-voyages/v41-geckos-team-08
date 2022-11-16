import { 
  CREATE_JOB_BY_USER_ID, 
  GET_JOBS, 
  ACCEPT_JOB_PROPOSAL,
  REJECT_JOB_PROPOSAL 
} from '../ActionTypes';

export const jobReducer = (state = [], action) => {
  switch (action.type) {
    case CREATE_JOB_BY_USER_ID:
      return [...state, action.payload];
    case GET_JOBS:
      const jobs_posted = action.payload.filter(job => job.is_taken === false);
      const jobs_in_progress = action.payload.filter(job => job.is_taken === true);
      return [{ jobs_posted, jobs_in_progress }];
    case ACCEPT_JOB_PROPOSAL:
    case REJECT_JOB_PROPOSAL:
    default:
      return state;
  }
}
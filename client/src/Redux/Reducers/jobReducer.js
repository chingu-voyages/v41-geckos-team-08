import { 
  CREATE_JOB_BY_USER_ID, 
  GET_JOBS, 
  ACCEPT_JOB_PROPOSAL
} from '../ActionTypes';

export const jobReducer = (state = [], action) => {

  let jobs_posted, jobs_in_progress;

  switch (action.type) {
    case CREATE_JOB_BY_USER_ID:
      return [...state, action.payload];
    case GET_JOBS:
      jobs_posted = action.payload.filter(job => job.is_taken === false);
      jobs_in_progress = action.payload.filter(job => job.is_taken === true && job.is_completed === false);
      return [{ jobs_posted, jobs_in_progress }];
    case ACCEPT_JOB_PROPOSAL:
      jobs_posted = state[0].jobs_posted.filter(job => job.uuid !== action.payload.uuid);
      jobs_in_progress = [action.payload, ...state[0].jobs_in_progress];
      return [{ jobs_posted, jobs_in_progress }];
    default:
      return state;
  }
}
import { CREATE_JOB_BY_USER_ID, GET_JOBS, CREATE_JOB_PROPOSAL } from '../ActionTypes';

export const jobReducer = (state = [], action) => {
  switch (action.type) {
    case CREATE_JOB_BY_USER_ID:
      return [...state, action.payload];
    case GET_JOBS:
      return action.payload;
    case CREATE_JOB_PROPOSAL:
    default:
      return state;
  }
}
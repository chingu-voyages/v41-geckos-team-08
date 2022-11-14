import { CREATE_JOB_BY_USER_ID, GET_JOBS } from '../ActionTypes';

export const jobReducer = (state = [], action) => {
  switch (action.type) {
    case CREATE_JOB_BY_USER_ID:
      return [...state, action.payload];
    case GET_JOBS:
      return action.payload;
    default:
      return state;
  }
}
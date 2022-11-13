import { CREATE_JOB_BY_USER_ID } from '../ActionTypes';

export const jobReducer = (state = [], action) => {
  switch (action.type) {
    case CREATE_JOB_BY_USER_ID:
      return [...state, action.payload]
    default:
      return state;
  }
}
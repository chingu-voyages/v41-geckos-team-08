import { CREATE_JOB_BY_USER_ID } from '../ActionTypes';

export const jobReducer = (state = [], action) => {
  switch (action.type) {
    case CREATE_JOB_BY_USER_ID:
      return state.map(item => (
        item.id === (action.payload.user)._id ?
        {
          ...item,
          jobs: [action.payload, ...item.jobs]
        } :
        item
      ));
    default:
      return state;
  }
}
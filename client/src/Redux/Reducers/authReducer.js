import { AUTH } from '../ActionTypes';

export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case AUTH:
      return action.payload;
    default:
      return state;
  }
}
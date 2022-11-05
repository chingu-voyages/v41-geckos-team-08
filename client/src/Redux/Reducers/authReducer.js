import { AUTH } from '../ActionTypes';

export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case AUTH:
      console.log(action.payload)
      return action.payload;
    default:
      return state;
  }
}
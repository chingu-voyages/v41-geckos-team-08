import { postAPI } from "../../Utils/Axios";
import { AUTH } from "../ActionTypes";

export const login = userLogin => async dispatch => {
 try {
  const res = await postAPI('login', userLogin);

  dispatch({
   type: AUTH,
   payload: res.data
  });

  localStorage.setItem('logged', 'true');
 } catch (error) {
  console.log(error);
 }
}

export const signup = userSignup => async dispatch => {
 try {
  const res = await postAPI('signup', userSignup);

  dispatch({
   type: AUTH,
   payload: res.data
  });

  localStorage.setItem('logged', 'true');
 } catch (error) {
  console.log(error);
 }
}
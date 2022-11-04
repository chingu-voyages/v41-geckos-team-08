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

export const signUp = userSignup => async dispatch => {
 try {
  const res = await postAPI('http://localhost:8080/users', userSignup);
console.log(res)
//   dispatch({
//    type: AUTH,
//    payload: res.data.data
//   });
 
//   localStorage.setItem('logged', 'true');
 } catch (error) {
  console.log(error);
 }
}
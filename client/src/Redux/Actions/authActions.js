import { postAPI } from "../../Utils/Axios";
import { AUTH } from "../ActionTypes";
import {RESET_STORE} from "../ActionTypes";

export const login = userLogin => async dispatch => {
 try {
  const res = await postAPI('login', userLogin);

  console.log(res);

  dispatch({
   type: AUTH,
   payload: res.data
  });

  const uuid = res.data.user.uuid;

  const userInfo = {
    token: res.data.token,
    uuid
  };

  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  window.location.href = `/user/${uuid}`;
 } catch (error) {
  console.log(error);
 }
}

export const signUp = userSignup => async dispatch => {
 try {
  const _res = await postAPI('users', userSignup);
  console.log(_res);
  if (userSignup.trades) {
    const res = await postAPI('trades', {
      description: [userSignup.trades]
    });
    console.log(res);
  }
//   dispatch({
//    type: AUTH,
//    payload: res.data.data
//   });
 
//   localStorage.setItem('logged', 'true');
 } catch (error) {
  console.log(error);
 }
}

export const logout = () => {
  localStorage.clear();
  resetStore();
  window.location.reload();
  window.location.pathname = '/';
}

// to reset the state of redux store
export const resetStore = () => {
  return {
    type: RESET_STORE
  }
}
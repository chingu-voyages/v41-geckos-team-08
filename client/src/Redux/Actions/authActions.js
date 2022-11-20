import { postAPI, putAPI } from "../../Utils/Axios";
import { AUTH, RESET_STORE } from "../ActionTypes";

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
  return error.response;
 }
}

export const signUp = userInputs => async dispatch => {
 try {
  const res = await postAPI('users', userInputs);
  console.log(res);
 } catch (error) {
  return error.response;
 }
}

export const updateUser = (userInputs, userUUID, token) => async dispatch => {
  try {
    const res = await putAPI(`users/${userUUID}`, userInputs, token);
    console.log(res);

    dispatch({
      type: AUTH,
      payload: res.data
    });

  } catch (error) {
    return error.response;
  }
}

export const logout = () => {
  localStorage.clear();
  resetStore();
  window.location.pathname = '/';
}

// to reset the state of redux store
export const resetStore = () => {
  return {
    type: RESET_STORE
  }
}
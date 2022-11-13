import { postAPI } from "../../Utils/Axios";
import { CREATE_JOB_BY_USER_ID } from "../ActionTypes";

export const createJob = (newJob, token) => async dispatch => {
 try {
  const res = await postAPI('jobs', newJob, token);

  console.log(res.data.data);

  dispatch({
   type: CREATE_JOB_BY_USER_ID,
   payload: res.data.data
  });

 } catch (error) {
  console.log(error);
 }
}
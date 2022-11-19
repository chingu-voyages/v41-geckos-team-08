import { getAPI, postAPI, putAPI } from "../../Utils/Axios";
import { CREATE_JOB_BY_USER_ID, ACCEPT_JOB_PROPOSAL, UPDATE_JOB_BY_USER_ID
 } from "../ActionTypes";

export const createJob = (newJob, token) => async dispatch => {
 try {
  const res = await postAPI('jobs', newJob, token);

  console.log(res.data.data);

  dispatch({
   type: CREATE_JOB_BY_USER_ID,
   payload: res.data.data
  });

  return res;

 } catch (error) {
  return error.response;
 }
}

export const updateJob = (newJob, jobUUID, token) => async dispatch => {
 try {
  const res = await putAPI(`jobs/${jobUUID}`, newJob, token);

  console.log(res.data.data);

  dispatch({
   type: UPDATE_JOB_BY_USER_ID,
   payload: res.data.data
  });

  return res;

 } catch (error) {
  return error.response;
 }
}

export const acceptJobProposal = (supplier, job, token) => async dispatch => {
 try {
  await putAPI(`proposals/${supplier}?job=${job}`, { is_accepted: true }, token);

  const res = await getAPI(`jobs/${job}`, token);

  console.log(res.data.data);

  dispatch({
   type: ACCEPT_JOB_PROPOSAL,
   payload: res.data.data
  });

  return res;

 } catch (error) {
  return error.response;
 }
}
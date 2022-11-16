import { postAPI, putAPI } from "../../Utils/Axios";
import { CREATE_JOB_BY_USER_ID, ACCEPT_JOB_PROPOSAL
 } from "../ActionTypes";

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

export const acceptJobProposal = (supplier, job, token) => async dispatch => {
 try {
  const { data: res } = await putAPI(`proposals/${supplier}?job=${job}`, { is_accepted: true }, token);

  console.log(res.data);

  dispatch({
   type: ACCEPT_JOB_PROPOSAL,
   payload: res.data
  });

 } catch (error) {
  console.log(error);
 }
}

export const rejectJobProposal = (supplier, job, token) => async dispatch => {
 try {
  const res = await putAPI(`proposals/${supplier}?job=${job}`, { is_accepted: false }, token);

  console.log(res);
 } catch (error) {
  console.log(error);
 }
}
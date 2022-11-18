import { postAPI, putAPI } from "../../Utils/Axios";
import { CREATE_JOB_PROPOSAL, UPDATE_JOB_PROPOSAL, COMPLETE_JOB } from "../ActionTypes";

export const createProposal = (proposal, token) => async dispatch => {
 try {
  const res = await postAPI('proposals', proposal, token);

  console.log(res);

  dispatch({
   type: CREATE_JOB_PROPOSAL,
   payload: res.data.data
  });
 } catch (error) {
  console.log(error);
 }
}

export const updateProposal = (supplier, job, proposal, token) => async dispatch => {
 try {
  const { data: res } = await putAPI(`proposals/${supplier}?job=${job}`, proposal, token);

  console.log(res.data);

  dispatch({
   type: UPDATE_JOB_PROPOSAL,
   payload: res.data
  });
 } catch (error) {
  console.log(error);
 }
}

export const completeJob = (job, token) => async dispatch => {
 try {
  const { data: res } = await putAPI(`jobs/${job}`, { is_completed: true }, token);

  console.log(res.data);

  dispatch({
   type: COMPLETE_JOB,
   payload: res.data
  });

 } catch (error) {
  console.log(error);
 }
}
import axios from 'axios';

export const postAPI = async (url, post, token) => {
  const res = await axios.post(`http://localhost:8080/${url}`, post, {
    headers: { authorization: token ? token : '' },
  });
  return res;
};

export const getAPI = async (url, token) => {
  const res = await axios.get(`http://localhost:8080/${url}`, {
    headers: { authorization: token ? token : '' },
  });

  return res;
};

export const patchAPI = async (url, post, token) => {
  const res = await axios.patch(`http://localhost:8080/${url}`, post, {
    headers: { authorization: token ? token : '' },
  });

  return res;
};

export const deleteAPI = async (url, token) => {
  const res = await axios.delete(`http://localhost:8080/${url}`, {
    headers: { authorization: token ? token : '' },
  });

  return res;
};

export const putAPI = async (url, post, token) => {
  const res = await axios.put(`http://localhost:8080/${url}`, post, {
    headers: { authorization: token ? token : '' },
  });

  return res;
};

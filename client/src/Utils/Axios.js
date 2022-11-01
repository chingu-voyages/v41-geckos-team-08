import axios from "axios";

export const postAPI = async (url, post, token) => {
  const res = await axios.post(`/api/${url}`, post, {
    headers: { Authorization: (token ? token : '') }
  })

  return res;
}

export const getAPI = async (url, token) => {
  const res = await axios.get(`/api/${url}`, {
    headers: { Authorization: (token ? token : '') }
  })

  return res;
}

export const patchAPI = async (url, post, token) => {
  const res = await axios.patch(`/api/${url}`, post, {
    headers: { Authorization: (token ? token : '') }
  })

  return res;
}

export const deleteAPI = async (url, token) => {
  const res = await axios.delete(`/api/${url}`, {
    headers: { Authorization: (token ? token : '') }
  })

  return res;
}

export const putAPI = async (url, post, token) => {
  const res = await axios.put(`/api/${url}`, post, {
    headers: { Authorization: (token ? token : '') }
  })

  return res;
}
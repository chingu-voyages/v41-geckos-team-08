import axios from 'axios';

const SERVER = process.env.REACT_APP_SERVER;

export const postAPI = async (url, post, token) => {
	const res = await axios.post(`${SERVER}${url}`, post, {
		headers: { authorization: token ? token : '' },
	});
	return res;
};

export const getAPI = async (url, token) => {
	const res = await axios.get(`${SERVER}${url}`, {
		headers: { authorization: token ? token : '' },
	});

	return res;
};

export const patchAPI = async (url, post, token) => {
	const res = await axios.patch(`${SERVER}${url}`, post, {
		headers: { authorization: token ? token : '' },
	});

	return res;
};

export const deleteAPI = async (url, token) => {
	const res = await axios.delete(`${SERVER}${url}`, {
		headers: { authorization: token ? token : '' },
	});

	return res;
};

export const putAPI = async (url, post, token) => {
	const res = await axios.put(`${SERVER}${url}`, post, {
		headers: { authorization: token ? token : '' },
	});

	return res;
};

import axios from 'axios';

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use(async config => {
	try {
		const session = JSON.parse(localStorage.getItem('session')) || JSON.parse(sessionStorage.getItem('session'));

		if (session !== null) {
			config.headers['Authorization'] = `Bearer ${session.token}`;
		}

		return config;
	} catch (error) {
		return Promise.reject(error);
	}
});

export default api;

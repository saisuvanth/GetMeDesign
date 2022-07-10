import axios from "axios";


export const setJwt = (jwt: string) => {
	localStorage.setItem('jwt', jwt);
}

export const useApi = () => {
	return axios.create({
		baseURL: 'http://localhost:8080',
		withCredentials: true,
	})
}


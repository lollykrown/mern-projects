import axios from 'axios';

const CancelToken = axios.CancelToken;
export const source = CancelToken.source();

const instance = axios.create({
    baseURL: 'http://localhost:8001',
    // baseURL: 'https://mern-backend.herokuapp.com',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    responseType: "json"
});


export default instance


import axios from 'axios';

const CancelToken = axios.CancelToken;
export const source = CancelToken.source();

const instance = axios.create({
    // baseURL: 'http://127.0.0.1:8001',
    baseURL: 'https://mern-backend.herokuapp.com',
    headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Header': '*'

        // "Access-Control-Allow-Credentials": "*"
    },
    withCredentials: true,
    responseType: "json"
});


export default instance


import axios from 'axios';

const CancelToken = axios.CancelToken;
export const source = CancelToken.source();

const instance = axios.create({
    baseURL: 'https://mern-backend.herokuapp.com',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    responseType: "json",
    //   cancelToken: new CancelToken(function executor(c) {
    //     // An executor function receives a cancel function as a parameter
    //     cancel = c;
    //     // if (axios.isCancel(error)) {
    //     //     console.log('Request canceled', error.message);
    //     //   }
    //   })

});

// axios.interceptors.response.use(response => {
//     return response;
// }, error => {
//     try {
//         if (axios.isCancel(error)) {
//             return new Promise(() => { });
//         }
//         return Promise.reject(error);
//     } catch (error) {
//         console.log(error)
//     }
// });

export default instance


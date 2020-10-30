import axios from 'axios';

const CancelToken = axios.CancelToken;
export const source = CancelToken.source();


const instance = axios.create({
    baseURL: 'http://localhost:8001',
    headers: {
        'Content-Type': 'application/json'
      },
      withCredentials:true,
      responseType: "json",
    //   cancelToken: new CancelToken(function executor(c) {
    //     // An executor function receives a cancel function as a parameter
    //     cancel = c;
    //     // if (axios.isCancel(error)) {
    //     //     console.log('Request canceled', error.message);
    //     //   }
    //   })

});

export default instance


import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { UserContext } from "../context/UserContext";
import logo from "../assets/logo.png";
import axios from 'axios';
import Axios from '../utils/axios'
import Loader from "./Loader";

export const FormWrapper = styled.div`
  background-color: ${(props) => props.theme.white};
  padding: 1rem;
  width: 350px;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin: 6rem auto;
  text-align: center;
  padding: 2rem 0;

  img {
    margin-bottom: 1.5rem;
  }

  input {
    display: block;
    margin: 0 auto;
    margin-bottom: 1rem;
    padding: 0.5rem 1.2rem;
    background: ${(props) => props.theme.white};
    border: 1px solid ${(props) => props.theme.borderColor};
    font-family: "Fira Sans", sans-serif;
    font-size: 1rem;
    border-radius: 4px;
    width: 85%;
  }

  input[type="submit"], .github {
    background-color: ${(props) => props.theme.blue};
    color: ${(props) => props.theme.white};
    border: 1px solid ${(props) => props.theme.blue};
    cursor: pointer;
    margin: 0 auto;
    margin-bottom: 1rem;
    padding: 0.5rem 1.2rem;
    font-family: "Fira Sans", sans-serif;
    font-size: 1rem;
    border-radius: 4px;
    width: 80%;
  }

  .github {
    background-color: ${(props) => props.theme.primaryColor};
    color: ${(props) => props.theme.white};
    border: 1px solid ${(props) => props.theme.blue};
    cursor: pointer;
  }
  .twitter {
    background-color: ${(props) => props.theme.rand};
    color: ${(props) => props.theme.white};
    border: 1px solid ${(props) => props.theme.blue};
    cursor: pointer;
    padding: 0.5rem 1.2rem;
  }
  p {
    margin-top: 2rem;
  }

  span {
    color: ${(props) => props.theme.blue};
    cursor: pointer;
  }
`;

const Login = (props) => {

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const { setUser } = useContext(UserContext);
  const username = useInput("");
  const password = useInput("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {    
      try {
        const res = await Axios.get('/me',  {
          cancelToken: source.token 
        })
          // console.log('checking', res)

          // if(!res.data.status){
          //   setLoading(false)
          //   localStorage.removeItem("user");
          //   toast.error('Your session expired, refresh to reedirect to login page')
          //   console.log('user',user)
          //   window.location.reload();
          // }

          if(res.data.status){
            setUser(res.data.data)
          }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          setLoading(false)
          throw error
        }
      }
    };
    
    checkAuthStatus()
    return () => {
      source.cancel('Operation canceled by the user.');
      console.log('unmount and cancel running axios request');
    };
  }, [setUser])

  const githubLogin = async() =>{
    try {
      const res = await Axios.get('http://127.0.0.1:8001/auth/github', {
        // headers: {
        //   'Authorization': 'c137cf89655e50b2f36dedbe624dac3485510cf0'
        // },
        cancelToken: source.token
      })

      if (!res.status) {
        toast.error(res.data.message)
        return;
      }
      localStorage.setItem("user", JSON.stringify(res.data.data));
      // setUser(res.data.data);
      console.log('github',res)
      toast.success("Login successful");
      setLoading(false);

    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Get request canceled');
        toast.error(err.message)
      } else {
        console.log(err)
        toast.error(err.message)
      }
    }
  }
  
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true)
    if (!username.value || !password.value) {
      return toast.error("Please fill in both the fields");
    }

    const body = { username: username.value, password: password.value };
    try {
      const res = await Axios.post('/login', body, {
        cancelToken: source.token
      })

      if (!res.status) {
        console.log(res.data)
        toast.error(res.data.message)
        window.location.reload();
        return;
      }
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setUser(res.data.data);
      toast.success("Login successful");
      setLoading(false);

    } catch (err) {
      setLoading(false)
      if (axios.isCancel(err)) {
        console.log('Get request canceled');
        toast.error(err.message)
      } else {
        console.log(err.response.data.error)
        toast.error(err.response.data.message)
      }
    }

    username.setValue("");
    password.setValue("");
    return () => {
      source.cancel('Operation canceled by the user.');
    };
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <FormWrapper onSubmit={handleLogin}>
      <img className="logo" src={logo} alt="logo" />
      <form>
        <input
          type="text"
          placeholder="username"
          value={username.value}
          onChange={username.onChange}
        />
        <input
          type="password"
          placeholder="password"
          value={password.value}
          onChange={password.onChange}
        />
        {/* <Link to="/accounts/change-password"><p>Change Password</p></Link> */}

        <input type="submit" value="Log In" className="login-btn" />
      </form>
      <a className="login-btn github" href="https://mern-backend.herokuapp.com/auth/github">Log In with Github</a>
      <a className="login-btn twitter" href="https://mern-backend.herokuapp.com/auth/twitter">Log In with Twitter</a>

      {/* <a className="login-btn github" href="http://127.0.0.1:8001/auth/github">Log In with Github</a>
      <a className="login-btn twitter" href="http://127.0.0.1:8001/auth/twitter">Log In with Twitter</a> */}

      {/* <button onClick={() => githubLogin()} className="login-btn github">Log In with Github</button> */}

      <div>
      <p><span onClick={props.changepassword}>Change Password</span></p>

        <p>
          Don't have an account? <span onClick={props.signup}>Sign up</span>
        </p>
      </div>
    </FormWrapper>
  );
};

export default Login;

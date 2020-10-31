import React, { useContext, useState } from "react";
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

  const googleLogin = async() =>{
    try {
      const res = await Axios.get('/github', {
        headers: {
          'Authorization': 'c137cf89655e50b2f36dedbe624dac3485510cf0'
        },
        cancelToken: source.token
      })

      if (!res.status) {
        toast.error(res.data.message)
        return;
      }
      localStorage.setItem("user", JSON.stringify(res.data.data));
      // setUser(res.data.data);
      console.log('google',res)
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
        console.log(err.message)
        toast.error(err.message)
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
        <input type="submit" value="Log In" className="login-btn" />
      </form>
      <button value="" onClick={() => googleLogin()} className="login-btn github">Log In with Github</button>

      <div>
        <p>
          Don't have an account? <span onClick={props.signup}>Sign up</span>
        </p>
      </div>
    </FormWrapper>
  );
};

export default Login;

import React, { useContext, useRef } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { UserContext } from "../context/UserContext";
import logo from "../assets/logo.png";
import axios from 'axios'
import { useLocation, withRouter } from "react-router";

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

  input[type="submit"] {
    background-color: ${(props) => props.theme.blue};
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

  console.log('props', props)
  const { setUser } = useContext(UserContext);
  const username = useInput("");
  const password = useInput("");

  const signal = useRef(axios.CancelToken.source());

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.value || !password.value) {
      return toast.error("Please fill in both the fields");
    }

    const body = { username: username.value, password: password.value };

    try {
      const res = await axios.post('http://localhost:8001/login', body, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        cancelToken: signal.current.token
      })

      if (!res.status) {
        //console.log(res.message)
        toast.error(res.data.message)
        return;
      }
      console.log(res)
      localStorage.setItem("user", JSON.stringify(res.data.data));

      // res.data.status && props.history.replace('/')
      setUser(res.data.data);
      toast.success("Login successful");
    } catch (err) {
      if (axios.isCancel(e)) {
        console.log('Get request canceled');
        toast.error(e.message)
      } else {
        console.log(err)
        toast.error(err.message)
      }
    }

    username.setValue("");
    password.setValue("");
  };

  return (
    <FormWrapper onSubmit={handleLogin}>
      <img className="logo" src={logo} alt="logo" />
      <form>
        <input
          type="text"
          placeholder="johnwick@gmail.com"
          value={username.value}
          onChange={username.onChange}
        />
        <input
          type="password"
          placeholder="mysuperpassword"
          value={password.value}
          onChange={password.onChange}
        />
        <input type="submit" value="Log In" className="login-btn" />
      </form>

      <div>
        <p>
          Don't have an account? <span onClick={props.signup}>Sign up</span>
        </p>
      </div>
    </FormWrapper>
  );
};

export default Login;

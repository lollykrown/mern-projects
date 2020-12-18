import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useInput from "../hooks/useInput";
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

const ChngPwd = (props) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const email = useInput("");
  const newPassword = useInput("");
  const confirmPassword = useInput("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true)

    // const location = {
    //   pathname: '/',
    //   state: { changePassword: true }
    // }
    if (!newPassword.value || !confirmPassword.value) {
      // history.push(location)
      window.location.reload();
      return toast.error("Please fill in all the fields");
    }

    const body = { email: email.value, newPassword: newPassword.value, confirmPassword: confirmPassword.value };
    try {
        const res = await Axios.put("/change-password", body, {
            cancelToken: source.token,
          });
    
          res.data.status && toast.info(res.data.message);

      if (!res.status) {
        toast.error(res.data.message)
        window.location.reload();
        return;
      }

      setLoading(false);
      window.location.reload();

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

    email.setValue("")
    newPassword.setValue("");
    confirmPassword.setValue("");
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
          placeholder="Email"
          value={email.value}
          onChange={email.onChange}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword.value}
          onChange={newPassword.onChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword.value}
          onChange={confirmPassword.onChange}
        />
        {/* <Link to="/accounts/change-password"><p>Change Password</p></Link> */}

        <input type="submit" value="Submit" className="login-btn" />
      </form>

      <div>
      <p><span onClick={props.login}>Login</span></p>

        <p>
          Don't have an account? <span onClick={props.signup}>Sign up</span>
        </p>
      </div>
    </FormWrapper>
  );
};

export default ChngPwd;

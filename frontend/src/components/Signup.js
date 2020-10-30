import React from "react";
import { toast } from "react-toastify";
import { FormWrapper } from "./Login";
import useInput from "../hooks/useInput";
import logo from "../assets/logo.png";
import axios from '../utils/axios'
import { source } from '../utils/axios'

const Signup = (props) => {
  const email = useInput("");
  const fullname = useInput("");
  const username = useInput("");
  const password = useInput("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.value || !password.value || !username.value || !fullname.value) {
      return toast.error("Please fill in all the fields");
    }

    if (username.value === "explore") {
      return toast.error(
        "The username you entered is not acceptable, try again"
      );
    }

    const re = /^[a-z0-9]+$/i;
    if (re.exec(username.value) === null) {
      return toast.error(
        "The username you entered is not acceptable, try again"
      );
    }

    const body = {
      email: email.value,
      password: password.value,
      username: username.value,
      fullname: fullname.value,
    };

    console.log(body)
    try {
      const res = await axios.post('/signup', body, {
        cancelToken: source.token
      })

      if (!res.status) {
        //console.log(res.message)
        toast.error(res.message || res.data.message)
        return;
      }
      res.data.status && toast.info('You have been registered, click on login to sign in')
    } catch (err) {
      if (axios.isCancel(e)) {
        console.log('Get request canceled');
        toast.error(e.message)
      } else {
        console.log(err)
        toast.error(err.message)
      }
    }

    fullname.setValue("");
    username.setValue("");
    password.setValue("");
    email.setValue("");
    return () => {
      source.cancel('Operation canceled by the user.');
    };
  };

  return (
    <FormWrapper onSubmit={handleLogin}>
      <img src={logo} alt="logo" />

      <form>
        <input
          type="email"
          placeholder="Email"
          value={email.value}
          onChange={email.onChange}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullname.value}
          onChange={fullname.onChange}
        />
        <input
          type="text"
          placeholder="Username"
          value={username.value}
          onChange={username.onChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password.value}
          onChange={password.onChange}
        />
        <input type="submit" value="Sign up" className="signup-btn" />
      </form>

      <div>
        <p>
          Already have an account? <span onClick={props.login}>Login</span>
        </p>
      </div>
    </FormWrapper>
  );
};

export default Signup;

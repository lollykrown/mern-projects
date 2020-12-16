import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import ChngPwd from "./ChngPwd";

const Auth = () => {
  const [auth, setAuth] = useState("LOGIN");

  const login = () => setAuth("LOGIN");
  const signup = () => setAuth("SIGNUP");
  const changepassword = () => setAuth("CHNG");

  if (auth === "CHNG") {
    return <ChngPwd login={login} signup={signup}/>;
  }
  if (auth === "LOGIN") {
    return <Login signup={signup} changepassword={changepassword} />;
  }

  if (auth === "SIGNUP") {
    return <Signup login={login} />;
  }
};

export default Auth;

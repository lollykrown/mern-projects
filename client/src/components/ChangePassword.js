import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import styled from "styled-components";
import Button from "../styles/Button";
import useInput from "../hooks/useInput";
import axios from "axios";
import Axios from "../utils/axios";

export const Wrapper = styled.div`
  padding: 1rem;

  img {
    cursor: pointer;
    margin-right: 40px;
  }

  .input-group {
    margin-top: 1.5rem;
  }

  .input-group > label {
    display: inline-block;
    width: 100px;
  }

  input,
  textarea {
    padding: 0.4rem 1rem;
    font-family: "Fira Sans", sans-serif;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.borderColor};
    width: 350px;
  }

  .textarea-group {
    display: flex;
  }

  .change-avatar {
    display: flex;
  }

  input[id="change-avatar"],
  input[id="change-avatar-link"] {
    display: none;
  }

  span,
  p {
    color: ${(props) => props.theme.blue};
    cursor: pointer;
  }

  button {
    margin-top: 1.5rem;
    margin-left: 6.25rem;
    margin-bottom: 1rem;
  }

  @media screen and (max-width: 550px) {
    width: 98%;

    .input-group {
      display: flex;
      flex-direction: column;
    }

    label {
      padding-bottom: 0.5rem;
      font-size: 1rem;
    }

    button {
      margin-left: 0;
    }
  }

  @media screen and (max-width: 430px) {
    input,
    textarea {
      width: 99%;
    }
  }
`;

const ProfileForm = () => {
  const history = useHistory();
  const { user } = useContext(UserContext);

  const email = useInput(user?.email);
  const newPassword = useInput("");
  const confirmPassword = useInput("");

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const handleRequest = async (b) => {
    try {
      const res = await Axios.put("/change-password", b, {
        cancelToken: source.token,
      });

      res.data.status && toast.info(res.data.message);

      history.push(`/`);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Get request canceled");
        toast.error(err.message);
      } else {
        console.log(err.response.data.error)
        toast.error(err.response.data.message)
      }
    }
    return () => {
      source.cancel("Operation canceled by the user.");
    };
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!newPassword.value) {
      return toast.error("The name field should not be empty");
    }

    if (!confirmPassword.value) {
      return toast.error("The username field should not be empty");
    }

    const body = {
      email: email.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    };
    handleRequest(body);
  };

  return (
    <Wrapper>
      <form onSubmit={handleChangePassword}>
        <div className="input-group change-avatar">
          <div className="change-avatar-meta">
            <h2>Change Password</h2>
          </div>
        </div>

        <div className="input-group">
          <label className="bold">Email</label>
          <input type="text" value={email?.value} onChange={email.onChange} />
        </div>

        <div className="input-group">
          <label className="bold">New Password</label>
          <input
            type="text"
            value={newPassword.value}
            onChange={newPassword.onChange}
          />
        </div>

        <div className="input-group">
          <label className="bold">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword.value}
            onChange={confirmPassword.onChange}
          />
        </div>

        <Button>Submit</Button>
      </form>
    </Wrapper>
  );
};

export default ProfileForm;

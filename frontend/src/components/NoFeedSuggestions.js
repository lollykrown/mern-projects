import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../styles/Avatar";
import Follow from "./Follow";
import Loader from "./Loader";
import { toast } from "react-toastify";
import axios from 'axios'
import Wrapper from "../styles/Wrapper";

const NoFeedSuggestions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const signal = useRef(axios.CancelToken.source());

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8001/users', {
          withCredentials: true,
          cancelToken: signal.current.token
        })

        console.log('suggestions', res)
        if (res.data.status) {
          setUsers(res.data.data);
          setLoading(false);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          toast.error(error)
        }
      }
    };

    getUsers()
    return () => {
      console.log('unmount and cancel running axios request');
      signal.current.cancel('Operation canceled by the user.');
    };
  }, [])


  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h3 style={{ marginBottom: "0.7rem" }}>Suggestions for you</h3>
      <Wrapper>
        {users.map((user) => (
          <div key={user._id} className="suggestion">
            <div className="user-info">
              <Avatar
                className="pointer"
                onClick={() => history.push(`/${user.username}`)}
                src={user.avatar}
                alt="avatar"
              />
              <div className="user-meta">
                <h4
                  className="pointer"
                  onClick={() => history.push(`/${user.username}`)}
                >
                  {user.username}
                </h4>
                <span className="secondary">{user.fullname}</span>
              </div>
            </div>
            <Follow isFollowing={user.isFollowing} userId={user._id} />
          </div>
        ))}
      </Wrapper>
    </div>
  );
};

export default NoFeedSuggestions;

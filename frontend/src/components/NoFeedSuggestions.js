import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "../styles/Avatar";
import Follow from "./Follow";
import Loader from "./Loader";
import { toast } from "react-toastify";
import Wrapper from "../styles/Wrapper";
import axios from '../utils/axios'
import { source } from '../utils/axios'

const NoFeedSuggestions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get('/users', {
          cancelToken: source.token
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
      source.cancel('Operation canceled by the user.');
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

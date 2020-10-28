import React, { useEffect, useRef, useState } from "react";
import Button from "../styles/Button";
import axios from 'axios'
import { toast } from "react-toastify";

const Follow = ({ nobtn, isFollowing, incFollowers, decFollowers, userId }) => {
  const [followingState, setFollowingState] = useState(isFollowing);

  useEffect(() => setFollowingState(isFollowing), [isFollowing]);

  const signal = useRef(axios.CancelToken.source());

  const handleRequest = async (action) => {
    try {
      const res = await axios.get(`http://localhost:8001/users/${userId}/${action}`, {
        withCredentials: true,
        cancelToken: signal.current.token
      })
      console.log(res)
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Get request canceled');
        toast.error(err.message)
      } else {
        console.log(err)
        toast.error(err.message)
      }
    }
  };

  const handleFollow = () => {
    if (followingState) {
      setFollowingState(false);
      if (decFollowers) {
        decFollowers();
      }
      handleRequest('unfollow')
    } else {
      setFollowingState(true);
      if (incFollowers) {
        incFollowers();
      }
      handleRequest('follow')
    }
  };

  if (followingState) {
    return (
      <>
        {nobtn ? (
          <span
            style={{ color: "#262626" }}
            className="pointer"
            onClick={() => handleFollow()}
          >
            Following
          </span>
        ) : (
          <Button onClick={() => handleFollow()}>Following</Button>
        )}
      </>
    );
  } else {
    return (
      <>
        {nobtn ? (
          <span className="pointer" onClick={() => handleFollow()}>
            Follow
          </span>
        ) : (
          <Button onClick={() => handleFollow()}>Follow</Button>
        )}
      </>
    );
  }
};

export default Follow;

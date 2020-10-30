import React, { useEffect, useState } from "react";
import Button from "../styles/Button";
import { toast } from "react-toastify";
import axios from 'axios';
import Axios from '../utils/axios'

const Follow = ({ nobtn, isFollowing, incFollowers, decFollowers, userId }) => {
  const [followingState, setFollowingState] = useState(isFollowing);

  useEffect(() => setFollowingState(isFollowing), [isFollowing]);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const handleRequest = async (action) => {
    try {
      const res = await Axios.get(`/users/${userId}/${action}`, {
        cancelToken: source.token
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
    return () => {
      source.cancel('Operation canceled by the user.');
    };
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

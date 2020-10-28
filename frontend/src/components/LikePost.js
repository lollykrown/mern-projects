import React, { useEffect, useRef, useState } from "react";
import { client } from "../utils";
import { HeartIcon, FilledHeartIcon } from "./Icons";
import axios from 'axios'
import { toast } from "react-toastify";

const LikePost = ({ isLiked, postId, incLikes, decLikes }) => {
  const [likedState, setLiked] = useState(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const signal = useRef(axios.CancelToken.source());

  const handleRequest = async (action) => {
    try {
      const res = await axios.get(`http://localhost:8001/posts/${postId}/${action}`, {
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

  const handleToggleLike = () => {
    if (likedState) {
      setLiked(false);
      decLikes();
      handleRequest('toggleLike');
    } else {
      setLiked(true);
      incLikes();
      handleRequest('toggleLike');
    }
  };

  if (likedState) {
    return <FilledHeartIcon onClick={handleToggleLike} />;
  }

  if (!likedState) {
    return <HeartIcon onClick={handleToggleLike} />;
  }
};

export default LikePost;

import React, { useEffect, useState } from "react";
import { HeartIcon, FilledHeartIcon } from "./Icons";
import axios from 'axios';
import Axios from '../utils/axios'
import { toast } from "react-toastify";

const LikePost = ({ isLiked, postId, incLikes, decLikes }) => {
  const [likedState, setLiked] = useState(isLiked);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleRequest = async (action) => {
    try {
      await Axios.get(`/posts/${postId}/${action}`, {
        cancelToken: source.token
      })
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

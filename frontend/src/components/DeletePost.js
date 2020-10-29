import React, { useContext, useRef } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FeedContext } from "../context/FeedContext";
import axios from 'axios'

const DeletePost = ({ postId, closeModal, goToHome }) => {
  const { feed, setFeed } = useContext(FeedContext);
  const history = useHistory();

  const signal = useRef(axios.CancelToken.source());

  const handleRequest = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8001/posts/${id}`, {
        withCredentials: true,
        cancelToken: signal.current.token
      })
      console.log(res)

    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(' request canceled');
        toast.error(err.message)
      } else {
        console.log(err)
        toast.error(err.message)
      }
    }
  }; 

  const handleDeletePost = () => {
    closeModal();

    if (goToHome) {
      history.push(`/`);
    }

    setFeed(feed.filter((post) => post._id !== postId));
    toast.success("Your post has been deleted successfully");
    handleRequest(postId)
  };

  return (
    <span className="danger" onClick={handleDeletePost}>
      Delete Post
    </span>
  );
};

export default DeletePost;

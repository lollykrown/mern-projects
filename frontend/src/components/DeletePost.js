import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FeedContext } from "../context/FeedContext";
import axios from '../utils/axios'
import { source } from '../utils/axios'

const DeletePost = ({ postId, closeModal, goToHome }) => {
  const { feed, setFeed } = useContext(FeedContext);
  const history = useHistory();

  const handleRequest = async (id) => {
    try {
      await axios.delete(`/posts/${id}`, {
        cancelToken: source.token
      })

    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(' request canceled');
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

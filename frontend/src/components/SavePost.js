import React, { useEffect, useRef, useState } from "react";
import { BookmarkIcon, FilledBookmarkIcon } from "./Icons";
import axios from 'axios'
import { toast } from "react-toastify";

const SavePost = ({ isSaved, postId }) => {
  const [savedState, setSaved] = useState(isSaved);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);


  const signal = useRef(axios.CancelToken.source());

  const handleRequest = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8001/posts/${id}/toggleSave`, {
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

  const handleToggleSave = () => {
    if (savedState) {
      setSaved(false);
      handleRequest(postId)
    } else {
      setSaved(true);
      handleRequest(postId)
    }
  };

  if (savedState) {
    return <FilledBookmarkIcon onClick={handleToggleSave} />;
  }

  if (!savedState) {
    return <BookmarkIcon onClick={handleToggleSave} />;
  }
};

export default SavePost;

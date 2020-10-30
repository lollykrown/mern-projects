import React, { useEffect, useRef, useState } from "react";
import { BookmarkIcon, FilledBookmarkIcon } from "./Icons";
import { toast } from "react-toastify";
import axios from '../utils/axios'
import { source } from '../utils/axios'

const SavePost = ({ isSaved, postId }) => {
  const [savedState, setSaved] = useState(isSaved);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const handleRequest = async (id) => {
    try {
      const res = await axios.get(`/posts/${id}/toggleSave`, {
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

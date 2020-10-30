import React, { useContext, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Modal from "./Modal";
import useInput from "../hooks/useInput";
import { FeedContext } from "../context/FeedContext";
import { uploadImage } from "../utils";
import { NewPostIcon } from "./Icons";
import axios from 'axios';
import Axios from '../utils/axios'

const NewPostWrapper = styled.div`
  .newpost-header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }

  .newpost-header h3:first-child {
    color: ${(props) => props.theme.red};
  }

  h3 {
    cursor: pointer;
  }

  .newpost-header h3:last-child {
    color: ${(props) => props.theme.blue};
  }

  textarea {
    height: 100%;
    width: 100%;
    font-family: "Fira Sans", sans-serif;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    resize: none;
  }

  .modal-content {
    width: 700px;
  }

  @media screen and (max-width: 780px) {
    .modal-content {
      width: 90vw;
    }
  }
`;

const NewPost = () => {
  const { feed, setFeed } = useContext(FeedContext);
  const [showModal, setShowModal] = useState(false);
  const caption = useInput("");
  const [preview, setPreview] = useState("");
  const [postImage, setPostImage] = useState("");

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  
  const handleUploadImage = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreview(e.target.result);
        setShowModal(true);
      };
      reader.readAsDataURL(e.target.files[0]);

      uploadImage(e.target.files[0]).then((res) => {
        console.log('cloudinary',res)
        setPostImage(res.data.secure_url);
      });
    }
  };

  const handleSubmitPost = async () => {
    if (!caption.value) {
      return toast.error("Please write a caption");
    }

    setShowModal(false);

    const tags = caption.value
      .split(" ")
      .filter((caption) => caption.startsWith("#"));

    const cleanedCaption = caption.value
      .split(" ")
      .filter((caption) => !caption.startsWith("#"))
      .join(" ");

    caption.setValue("");

    const body = {
      caption: cleanedCaption,
      files: [postImage],
      tags,
    };

    try {
      const res = await Axios.post('/posts', body, {
        cancelToken: source.token
      })
      console.log(res)
      const post = res.data.data;
      post.isLiked = false;
      post.isSaved = false;
      post.isMine = true;
      setFeed([post, ...feed]);
      window.scrollTo(0, 0);
      toast.success("Your post has been submitted successfully");
    
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

  return (
    <NewPostWrapper>
      <label htmlFor="upload-post">
        <NewPostIcon />
      </label>
      <input
        id="upload-post"
        type="file"
        onChange={handleUploadImage}
        accept="image/*"
        style={{ display: "none" }}
      />
      {showModal && (
        <Modal>
          <div className="modal-content">
            <div className="newpost-header">
              <h3 onClick={() => setShowModal(false)}>Cancel</h3>
              <h3 onClick={handleSubmitPost}>Share</h3>
            </div>
            {preview && (
              <img className="post-preview" src={preview} alt="preview" />
            )}
            <div>
              <textarea
                placeholder="Add caption"
                value={caption.value}
                onChange={caption.onChange}
              />
            </div>
          </div>
        </Modal>
      )}
    </NewPostWrapper>
  );
};

export default NewPost;

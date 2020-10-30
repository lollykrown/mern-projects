import React, { useState, useEffect } from "react";
import PostPreview from "../components/PostPreview";
import Loader from "../components/PostPreview";
import axios from 'axios';
import Axios from '../utils/axios'

const Explore = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  useEffect(() => {
    const getPosts = async () => {    
  
      try {
        const res = await Axios.get('/posts',  {cancelToken: source.token })
        setPosts(res.data.data);
        setLoading(false);

      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          throw error
        }
      }
    };
    
    getPosts()
    return () => {
      source.cancel('Operation canceled by the user.');
    };
  }, [])

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div style={{ marginTop: "2.3rem" }}>
        <h2>Explore</h2>
        <PostPreview posts={posts} />
      </div>
    </>
  );
};

export default Explore;

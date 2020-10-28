import React, { useState, useEffect, useRef } from "react";
import PostPreview from "../components/PostPreview";
import Loader from "../components/PostPreview";
import axios from 'axios'

const Explore = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const signal = useRef(axios.CancelToken.source());

  useEffect(() => {

    const getPosts = async () => {    
  
      try {
        const res = await axios.get('http://localhost:8001/posts',  {
          withCredentials:true,
          cancelToken: signal.current.token })

          console.log('posts', res)
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
      console.log('unmount and cancel running axios request');
      signal.current.cancel('Operation canceled by the user.');
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

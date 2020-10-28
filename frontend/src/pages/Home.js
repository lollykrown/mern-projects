import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Suggestions from "../components/Suggestions";
import NoFeedSuggestions from "../components/NoFeedSuggestions";
import Post from "../components/Post";
import Loader from "../components/Loader";
import { FeedContext } from "../context/FeedContext";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import axios from 'axios'

const Wrapper = styled.div`
  @media screen and (max-width: 1040px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Home = (props) => {
  const { user, setUser } = useContext(UserContext);
  const { feed, setFeed } = useContext(FeedContext);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const logout = () => {
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("user");
  //     setUser(null);
  //   };

  //   client("/users/feed")
  //     .then((res) => {
  //       setFeed(res.data);
  //       setLoading(false);
  //     })
	// 		.catch(res => {
  //       if(!res.status){
  //         props.history.replace('/login')
  //       }
  //       console.log(res)
  //     });
  // }, [setFeed, setUser]);

  const signal = useRef(axios.CancelToken.source());


  useEffect(() => {

    const getPosts = async () => {    
  
      try {
        const res = await axios.get('http://localhost:8001/posts',  {
          withCredentials:true,
          cancelToken: signal.current.token })
          console.log('posts', res)
          setFeed(res.data)
          setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          throw error
        }
      }
    };
    
    const checkAuthStatus = async () => {    
  
      try {
        const res = await axios.get('http://localhost:8001/me',  {
          withCredentials:true,
          cancelToken: signal.current.token })

          console.log('checking', res)
          if(res.data.status){
            setUser(res.data.data)
            getPosts()
          }

          if(!res.data.status){
            localStorage.removeItem("user");
            console.log('user',user)
            toast.error(res.data.message)
          }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          throw error
        }
      }
    };
    
    checkAuthStatus()
    return () => {
      console.log('unmount and cancel running axios request');
      signal.current.cancel('Operation canceled by the user.');
    };
  }, [user, setFeed])

  // useEffect(() => {

  //   getPosts()
  //   return () => {
  //     console.log('unmount and cancel running axios request');
  //     signal.current.cancel('Operation canceled by the user.');
  //   };
  // }, [])

  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      {feed.length > 0 ? (
        <>
          <div className="home">
            {feed.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
          <Suggestions />{" "}
        </>
      ) : (
        <NoFeedSuggestions />
      )}
    </Wrapper>
  );
};

export default Home;

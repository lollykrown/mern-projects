import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Suggestions from "../components/Suggestions";
import NoFeedSuggestions from "../components/NoFeedSuggestions";
import Post from "../components/Post";
import Loader from "../components/Loader";
import { FeedContext } from "../context/FeedContext";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import axios from 'axios';
import Axios from '../utils/axios'

const Wrapper = styled.div`
  @media screen and (max-width: 1040px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const { feed, setFeed } = useContext(FeedContext);
  const [loading, setLoading] = useState(true);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  
  useEffect(() => {
    const checkAuthStatus = async () => {    
      try {
        const res = await Axios.get('/me',  {
          cancelToken: source.token 
        })
          // console.log('checking', res)

          if(!res.data.status){
            setLoading(false)
            localStorage.removeItem("user");
            toast.error('Your session expired, refresh to reedirect to login page')
            console.log('user',user)
            window.location.reload();
          }

          if(res.data.status){
            setUser(res.data.data)
          }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          setLoading(false)
          throw error
        }
      }
    };
    
    checkAuthStatus()
    return () => {
      source.cancel('Operation canceled by the user.');
      console.log('unmount and cancel running axios request');
    };
  }, [setUser])

  // }, [setUser, history, user])

  useEffect(() => {
    const getPosts = async () => {    
      try {
        const res = await Axios.get('/posts',  {
          cancelToken: source.token 
        })

          setFeed(res.data.data)
          setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          setLoading(false)
          throw error
        }
      }
    };
    
    getPosts()
    return () => {
      source.cancel('Operation canceled by the user.');
    };
  }, [setFeed])

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

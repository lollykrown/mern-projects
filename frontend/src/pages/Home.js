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
import { useHistory } from "react-router-dom";

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

  const signal = useRef(axios.CancelToken.source());

  const history = useHistory();
  // console.log('history in home', history)

  useEffect(() => {
    const checkAuthStatus = async () => {    
  
      try {
        const res = await axios.get('http://localhost:8001/me',  {
          withCredentials:true,
          cancelToken: signal.current.token })

          console.log('checking', res)

          if(!res.data.status){
            localStorage.removeItem("user");
            console.log('user',user)
            history.push('/')
            toast.error('Your session is expired')
          }

          if(res.data.status){
            setUser(res.data.data)
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
  }, [setUser])


  useEffect(() => {

    const getPosts = async () => {    
  
      try {
        const res = await axios.get('http://localhost:8001/posts',  {
          withCredentials:true,
          cancelToken: signal.current.token })
          setFeed(res.data.data)
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

import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Follow from "./Follow";
import Avatar from "../styles/Avatar";
import { UserContext } from "../context/UserContext";
import axios from 'axios';
import Axios from '../utils/axios'
import { source } from '../utils/axios'

const Wrapper = styled.div`
  width: 280px;
  margin-top: 1rem;
  position: fixed;
  top: 6rem;
  left: 66%;

  .suggestions {
    margin-top: 1.8rem;
  }

  .suggestions div {
    width: 230px;
  }

  .suggestions > h4 {
    margin-bottom: 0.35rem;
  }

  .suggestions-usercard {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
  }

  .suggestions img {
    width: 44px;
    height: 44px;
    border-radius: 22px;
  }

  .follow {
    position: relative;
    top: -0.3rem;
  }

  span {
    color: ${(props) => props.theme.blue};
    font-weight: 400;
  }

  @media screen and (max-width: 1095px) {
    left: 67.5%;
  }

  @media screen and (max-width: 1040px) {
    display: none;
  }
`;

const StyledUserCard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  .capitalize{
    text-transform:capitalize;
  }
  span {
    color: ${(props) => props.theme.secondaryColor};
  }
`;

export const UserCard = ({ user }) => {
  const history = useHistory();

  return (
    <StyledUserCard>
      <Avatar
        className="pointer"
        onClick={() => history.push(`/${user.username}`)}
        lg
        src={user.avatar}
        alt="avatar"
      />

      <div className="user-info">
        <h4
          className="pointer"
          onClick={() => history.push(`/${user.username}`)}
        >
          {user.username}
        </h4>
        <span className="capitalize">{user.fullname}</span>
      </div>
    </StyledUserCard>
  );
};

const Suggestions = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {    
      try {
        const res = await Axios.get('/users',  {
          cancelToken: source.token })

          setUsers(res.data.data.filter((user) => !user.isFollowing));

      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          throw error
        }
      }
    };
    
    loadUsers()
    return () => {
      source.cancel('Operation canceled by the user.');
    };
  }, [users])

  return (
    <Wrapper>
      <UserCard user={user} />

      <div className="suggestions">
        <h3>Suggestions For You</h3>
        {users.slice(0,5).map((user) => (
            <div key={user.username} className="suggestions-usercard">
              <UserCard user={user} />
              <Follow nobtn isFollowing={user.isFollowing} userId={user._id} />
            </div>
          ))}
        {users.length === 0 && <p>Right now, there's no suggestions for you</p>}
      </div>
    </Wrapper>
  );
};

export default Suggestions;

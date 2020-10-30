import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Avatar from "../styles/Avatar";
import axios from 'axios';
import Axios from '../utils/axios'

const InputWrapper = styled.input`
  padding: 0.4rem 0.6rem;
  background: ${(props) => props.theme.bg};
  border: 1px solid ${(props) => props.theme.borderColor};
  font-family: "Fira Sans", sans-serif;
  font-size: 1rem;
  border-radius: ${(props) => props.theme.borderRadius};
`;
const SearchWrapper = styled.div`
background-color:#fff;
width: 230px;
display: flex;
flex-direction: column;
text-align: center;
position absolute;
left:400px;
top:70px;
height:300px;
border: 1px solid rgba(0,0,0,0.07);
overflow-x:scroll;

.username, .name{
  text-align: left;
  font-size: 0.85rem;
  line-height: 1;
}
.name{
  color: rgba(0,0,0,0.5);
}
.user-info {
  padding: .5rem .75rem;
  display: flex;
  // justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.2);
}
.user-info:hover{
  background-color: rgba(0,0,0,0.025);
}
`;

const Search = () => {
  const history = useHistory();

  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([]);
  const [filtered, setFilteredUsers] = useState([])

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  useEffect(() => {
    const loadUsers = async () => {

      try {
        const res = await Axios.get('/users', {
          cancelToken: source.token
        })

        setUsers(res.data.data);

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
  }, [])

  useEffect(() => {
    setFilteredUsers(
      users.filter(m => {
        return m.username.toLowerCase().includes(search.toLowerCase()) ||
        m.fullname.toLowerCase().includes(search.toLowerCase()) 
      })
    )
  }, [search, users])

  const setVal = (e) => {
    const value = e.target.value;
    setSearch(value)
  }

  return (
    <>
      <InputWrapper
        type="search"
        value={search}
        onChange={e => setVal(e)}
        placeholder="Search"
        aria-label="Search"
      />
      {search.length > 0 && filtered.map((u) => (
        <SearchWrapper key={u._id} onClick={() => {
          history.push(`/${u.username}`)
          setSearch('')
          }}>
          <div className="user-info">
            <Avatar
              className="pointer"
              src={u?.avatar}
              alt="avatar"
            />
            <div className="user-meta">
              <h4 className="username" >
                {u.username}
              </h4>
              <span className="name">{u.fullname}</span>
            </div>
          </div>
        </SearchWrapper>)
      )}
    </>
  );
};

export default Search;

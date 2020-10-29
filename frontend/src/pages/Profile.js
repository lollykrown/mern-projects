import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import PostPreview from "../components/PostPreview";
import ProfileHeader from "../components/ProfileHeader";
import Placeholder from "../components/Placeholder";
import Loader from "../components/Loader";
import { PostIcon, SavedIcon } from "../components/Icons";
import axios from 'axios'
import Button from "../styles/Button";
import PlaceholderContainer from "../styles/PlaceholderContainer";

const Wrapper = styled.div`
  .profile-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.4rem 0;
  }
.uppercase{
  text-transform: uppercase;
}
  .profile-tab div {
    display: flex;
    cursor: pointer;
    margin-right: 3rem;
  }

  .profile-tab span {
    padding-left: 0.3rem;
  }

  .profile-tab svg {
    height: 24px;
    width: 24px;
  }

  hr {
    border: 0.5px solid ${(props) => props.theme.borderColor};
  }
`;

const Profile = () => {
  const [tab, setTab] = useState("POSTS");

  const { username } = useParams();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [deadend, setDeadend] = useState(false);

  const signal = useRef(axios.CancelToken.source());

  useEffect(() => {

    const s = signal
    const getUser = async () => {

      try {
        const res = await axios.get(`http://localhost:8001/users/${username}`, {
          withCredentials: true,
          cancelToken: s.current.token
        })
        if (res.data.status) {
          setLoading(false);
          setDeadend(false);
          setProfile(res.data.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          setDeadend(true)
          throw error
        }
      }
    };

    getUser()
    return () => {
      console.log('unmount and cancel running axios request');
      s.current.cancel('Operation canceled by the user.');
    };
  }, [username])

  if (!deadend && loading) {
    return <Loader />;
  }

  if (deadend) {
    return (
      <PlaceholderContainer>
        <Placeholder
          title="Sorry, this page isn't available"
          text="The link you followed may be broken, or the page may have been removed"
        />
        <Link to="/"><Button>Home</Button></Link>
      </PlaceholderContainer>
    );
  }

  return (
    <Wrapper>
      <ProfileHeader profile={profile} />
      <hr />

      <div className="profile-tab">
        <div
          style={{ fontWeight: tab === "POSTS" ? "500" : "" }}
          onClick={() => setTab("POSTS")}
        >
          <PostIcon />
          <span className="uppercase">Posts</span>
        </div>
        <div
          style={{ fontWeight: tab === "SAVED" ? "500" : "" }}
          onClick={() => setTab("SAVED")}
        >
          <SavedIcon />
          <span className="uppercase">Saved</span>
        </div>
      </div>

      {tab === "POSTS" && (
        <>
          {profile?.posts?.length === 0 ? (
            <Placeholder
              title="Posts"
              text="Once you start making new posts, they'll appear here"
              icon="post"
            />
          ) : (
              <PostPreview posts={profile?.posts} />
            )}
        </>
      )}

      {tab === "SAVED" && (
        <>
          {profile?.savedPosts?.length === 0 ? (
            <Placeholder
              title="Saved"
              text="Save photos and videos that you want to see again"
              icon="bookmark"
            />
          ) : (
              <PostPreview posts={profile?.savedPosts} />
            )}
        </>
      )}
    </Wrapper>
  );
};

export default Profile;

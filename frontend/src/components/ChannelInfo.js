import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import Button from "../styles/Button";
import { subscribeChannel, unsubscribeChannel } from "../actions";
import {
  SUBSCRIBE_FROM_CHANNEL_RECOMMENDATIONS,
  UNSUBSCRIBE_FROM_CHANNEL_RECOMMENDATIONS,
  SUBSCRIBE_FROM_SEARCH_RESULTS,
  UNSUBSCRIBE_FROM_SEARCH_RESULTS,
} from "../actions/types";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2rem 0;

  .avatar-channel {
    display: flex;
    align-items: center;
  }

  .subscribe-channel {
    display: flex;
    align-items: center;
  }

  .description {
    width: 90%;
  }

  img {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    object-fit: cover;
    margin-right: 1.2rem;
  }

  p span:first {
    padding-right: 0.6rem;
  }

  @media screen and (max-width: 580px) {
    font-size: 0.9rem;

    button {
      font-size: 0.9rem;
    }

    img {
      width: 100px;
      height: 100px;
      border-radius: 50px;
    }
  }

  @media screen and (max-width: 510px) {
    p.description {
      display: none;
    }
  }

  @media screen and (max-width: 450px) {
    img {
      width: 50px;
      height: 50px;
      border-radius: 25px;
    }
  }

  @media screen and (max-width: 420px) {
    .to-hide {
      display: none;
    }
  }
`;

const ChannelInfo = ({
  search,
  channel,
  unsubscribeChannel,
  subscribeChannel,
}) => {
  const handleSubscribe = () => {
    subscribeChannel({
      channel: {
        avatar: channel.avatar,
        id: channel.id,
        username: channel.username,
      },
      type: !search
        ? SUBSCRIBE_FROM_CHANNEL_RECOMMENDATIONS
        : SUBSCRIBE_FROM_SEARCH_RESULTS,
    });
  };

  const handleUnsubscribe = () => {
    unsubscribeChannel({
      type: !search
        ? UNSUBSCRIBE_FROM_CHANNEL_RECOMMENDATIONS
        : UNSUBSCRIBE_FROM_SEARCH_RESULTS,
      channelId: channel.id,
    });
  };

  return (
    <Wrapper>
      <Link to={`/channel/${channel.id}`} className="avatar-channel">
        <img src={channel.avatar} alt="avatar" />
        <div className="channel-info-meta">
          <h3>{channel.username}</h3>
          <p className="secondary">
            <span>{channel.subscribersCount} subscribers</span>{" "}
            <span className="to-hide">•</span>{" "}
            <span className="to-hide">{channel.videosCount} videos</span>
          </p>
          {channel.channelDescription && (
            <p className="description secondary">
              {channel.channelDescription?.length < 65
                ? channel.channelDescription
                : channel.channelDescription?.substr(0, 65)}
            </p>
          )}
        </div>
      </Link>

      {!channel.isMe && !channel.isSubscribed && (
        <Button onClick={handleSubscribe}>Subscribe</Button>
      )}

      {!channel.isMe && channel.isSubscribed && (
        <Button grey onClick={handleUnsubscribe}>
          Subscribed
        </Button>
      )}
    </Wrapper>
  );
};

export default connect(null, { subscribeChannel, unsubscribeChannel })(
  ChannelInfo
);

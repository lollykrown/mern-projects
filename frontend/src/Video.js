import React, { useRef, useState } from 'react'
import './Video.css'
import VideoFooter from './VideoFooter';
import VideoSidebar from './VideoSidebar';
import tik from './tik.mp4'

const Video = () => {
    const [playing, setPlaying] = useState(false);

    const videoRef = useRef(null)

    const handleVideoPress = () => {
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play()
            setPlaying(true)
        }
    }

    return (

        <div className="video">
            <video ref={videoRef} className="video__player" loop
                src={tik}>
                onClick={handleVideoPress}
            </video>

            <VideoFooter channel="lollykrown" desc="epic"/>
            <VideoSidebar likes={111} shares={222} messages={333}/>
        </div>
    )
}

export default Video

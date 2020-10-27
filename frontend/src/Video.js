import React, { useRef, useState } from 'react'
import './Video.css'
import VideoFooter from './VideoFooter';
import VideoSidebar from './VideoSidebar';

const Video = () => {
    const [playing, setPlaying] = useState(false);

    const videoRef = useRef(null)

    const handleVideoPress = () => {
        if (playing) {
            videoRef.current.pause;
            setPlaying(false);
        } else {
            videoRef.current.play
            setPlaying(true)
        }
    }

    return (
        <>
            <div className="video">
                <iframe title="vid1" ref={videoRef} className="video__player" loop
                    src="https://www.youtube.com/embed/tgbNymZ7vqY">

                </iframe>
            </div>
            <VideoFooter />
            <VideoSidebar />
        </>
    )
}

export default Video

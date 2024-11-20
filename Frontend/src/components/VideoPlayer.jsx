import React from 'react'
import ReactPlayer from 'react-player';

function VideoPlayer({ videoFile }) {
    return (
        <div className="aspect-video">
            <ReactPlayer
                url={videoFile}
                className=""
                width="100%"
                height="100%"
                controls
                playing
            />
        </div>
    )
}

export default VideoPlayer

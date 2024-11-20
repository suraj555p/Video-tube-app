import React from 'react';

function VideoCard({ avatar, thumbnail, title, username, views = 0, duration, uploadDate }) {
    duration = Math.round(duration)
    const maxLen = 30;
    const truncatedTitle = (title?.length > maxLen) ? title.slice(0, maxLen)+"..." : title
    const truncatedFullname = (username?.length > maxLen) ? username.slice(0, maxLen)+"..." : username
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-2 max-w-xs w-full">
            <img className="rounded-lg mb-2 w-full h-36 object-cover" src={thumbnail} alt={title} />
            <h2 className="text-base font-bold mb-1">{truncatedTitle}</h2>
            <div className='flex flex-wrap justify-start items-center gap-2 mb-2'>
                <img className='h-8 w-8 rounded-full' src={avatar}></img>
                <p>{username}</p>
            </div>
            <div className='flex flex-wrap justify-start gap-3 items-start'>
                <p className="text-gray-600 mb-1">{views} views</p>
            </div>
        </div>
    );
}

export default VideoCard;

import React from 'react';

function VideoCard({ avatar, thumbnail, title, username, views = 0, duration, uploadDate }) {
    duration = Math.round(duration);
    const maxLen = 50; // Increased max length for title
    const truncatedTitle = (title?.length > maxLen) ? title.slice(0, maxLen) + "..." : title;
    const truncatedFullname = (username?.length > maxLen) ? username.slice(0, maxLen) + "..." : username;

    return (
        <div className="bg-neutralGray rounded-lg shadow-md overflow-hidden mb-4 max-w-md w-full">
            {/* Thumbnail */}
            <img className="w-full h-48 object-cover" src={thumbnail} alt={title} />
            
            {/* Video Details */}
            <div className="p-4 flex">
                {/* Avatar */}
                <img className="h-10 w-10 rounded-full mr-3" src={avatar} alt={username} />
                
                {/* Title and Meta Info */}
                <div className="flex-1">
                    <h2 className="text-base font-semibold text-gray-800 mb-1">{truncatedTitle}</h2>
                    <p className="text-sm font-medium text-gray-700 mb-1">{truncatedFullname}</p>
                    <p className="text-xs text-gray-500">
                        {views.toLocaleString()} views • {duration} mins
                    </p>
                    <p className="text-xs text-gray-500">{uploadDate}</p>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;

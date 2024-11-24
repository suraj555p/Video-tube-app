import React, { useEffect, useState } from 'react';
import Header from './Header';
import VideoCard from './VideoCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UseReactQuery from '../Custom_Hook/useReactQuery';
import ErrorPage from './ErrorPage';
import LoaderPage from './LoadingPage';

function Profile() {
    // const [stats, setStats] = useState();
    // const[videos, setVideos] = useState([]);
    // const[user, setUser] = useState({})
    const token = useSelector(state => state.accessTokenSlice.token)
    const navigate = useNavigate()

    const stats = UseReactQuery('https://videotube-server-kmvo.onrender.com/api/v1/dashboard/stats', 'GET')
    const videos = UseReactQuery('https://videotube-server-kmvo.onrender.com/api/v1/dashboard/videos', 'GET')
    const user = UseReactQuery('https://videotube-server-kmvo.onrender.com/api/v1/users/current-user', 'GET')

    const handleClick = (videoId) => {
        navigate(`/v/${videoId}`, { state: videoId })
    }

    return (
        <div className='flex flex-wrap items-center flex-col bg-softBlue min-h-screen w-full'>
            <Header />
            {
                (user.error || stats.error || videos.error) &&
                <ErrorPage />
            }
            {
                (user.loading || stats.loading || videos.loading) &&
                <LoaderPage />
            }
            {
                
                (!user.error && !user.loading && !videos.error && !videos.loading && !stats.error && !stats.loading &&
                    <div className='w-full'>
                        {/* profile section */}
                        <div className="bg-gray-300 rounded-lg shadow-lg p-6 w-full">
                            {/* Rounded profile photo */}
                            <div className="flex items-center justify-center mb-6">
                                <img className="rounded-full h-24 w-24 object-cover" src={user.response.avatar ? user.response.avatar : 'image/null-avatar.png'} alt='Profile photo' />
                            </div>

                            {/* Fullname and Username */}
                            <div className="text-center">
                                <h2 className="text-xl font-semibold">{user.response.fullName}</h2>
                                <p className="text-gray-600">{user.response.username}</p>
                            </div>

                            {/* subsribers and subscribed */}
                            <div className='flex flex-wrap flex-col justify-center items-center font-bold gap-2'>
                                <p>Subscribers: {stats?.response?.subscribers?.subscribersCount}</p>
                                {/* <p>Subscribed: 22</p> */}
                            </div>

                            {/* more information about profile */}
                            <div className="mt-6">
                                <div className="flex justify-center gap-10">
                                    <div className="text-center">
                                        <p className="text-gray-600">Total Views</p>
                                        <p className="text-lg font-semibold">{stats?.response?.totalViews?.viewsCount}</p>
                                    </div>
                                    {/* <div className="text-center">
                                        <p className="text-gray-600">Total Likes</p>
                                        <p className="text-lg font-semibold">{stats?.response?.totalLikes?.likesCount}</p>
                                    </div> */}
                                    <div className="text-center">
                                        <p className="text-gray-600">Total Videos</p>
                                        <p className="text-lg font-semibold">{stats?.response?.totalVideos?.videosCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* videos section */}
                        {
                            (videos.response.length !== 0) ? (
                                <div className='flex flex-wrap justify-start items-start min-h-screen w-full gap-4 p-4 bg-gray-200'>
                                    {   
                                        videos?.response?.map((video) => (
                                            <div key={video._id} onClick={() => handleClick(video?._id)} className='w-80'>
                                                <VideoCard  thumbnail={video.thumbnail} title={video.title} fullName={user.fullName} />
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : (
                            
                                <div className='w-full text-xl font-semibold text-black flex flex-wrap justify-center items-center'>
                                    No videos
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
}

export default Profile;

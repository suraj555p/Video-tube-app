import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import VideoPlayer from '../VideoPlayer';
import Container from '../container/Container';
import Footer from './Footer';
import Header from '../Header';
import UseReactQuery from '../../Custom_Hook/useReactQuery.js';
import AllComment from './AllComment';
import CommentForm from './CommentForm';
import ErrorPage from '../ErrorPage.jsx';
import LoaderPage from '../LoadingPage.jsx';

function Video() {
    const [isOwner, setIsOwner] = useState(false);
    const [curUser, setCurUser] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [videoData, setVideoData] = useState(null);
    const [comments, setComments] = useState([]);
    const videoObj = UseReactQuery('https://videotube-server-kmvo.onrender.com/api/v1/videos/home-videos', 'GET');
    const location = useLocation();
    const videoId = location.state;
    const videoInfo = UseReactQuery(`https://videotube-server-kmvo.onrender.com/api/v1/videos/c/${videoId}`, 'GET');
    const userId = videoInfo?.response?.owner?._id;
    const token = useSelector((state) => state.accessTokenSlice.token);
    const navigate = useNavigate();

    const handleClick = (videoId) => {
        navigate(`/v/${videoId}`, { state: videoId });
    };

    const fetchVideoData = useCallback(async () => {
        try {
            const response = await fetch(`https://videotube-server-kmvo.onrender.com/api/v1/videos/c/${videoId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
                mode: 'cors',
                credentials: 'include',
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                setVideoData(jsonResponse.data);
            } else {
                throw new Error("Error fetching video data");
            }
        } catch (error) {
            console.error(error);
        }
    }, [videoId, token]);

    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch(`https://videotube-server-kmvo.onrender.com/api/v1/comments/d/${videoId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
                mode: 'cors',
                credentials: 'include',
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                setComments(jsonResponse.data);
            } else {
                throw new Error("Error fetching comments");
            }
        } catch (error) {
            console.error(error);
        }
    }, [videoId, token]);

    const handleSubscribe = async () => {
        try {
            const response = await fetch(`https://videotube-server-kmvo.onrender.com/api/v1/subscriptions/c/${userId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                mode: 'cors',
                credentials: 'include',
            });
            if (response.ok) {
                setSubscribed(!subscribed);
            } else {
                console.error("Error subscribing");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchVideoData();
        fetchComments();
    }, [fetchVideoData, fetchComments]);

    return (
        <Container>
            <Header />
            <div className="flex flex-col md:flex-row h-screen">
                {/* Video Player Section */}
                <div className="flex-1 bg-gray-200 p-4">
                    {videoData && <VideoPlayer videoFile={videoData.videoFile} />}
                    {videoData && (
                        <div className="mt-4 text-black">
                            <h1 className="text-xl font-bold">{videoData.title}</h1>
                            <p className="text-black">{videoData.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    onClick={handleSubscribe}
                                    className={`px-4 py-2 text-sm font-medium rounded ${
                                        subscribed ? 'bg-gray-500' : 'bg-red-500'
                                    }`}
                                >
                                    {subscribed ? 'Unsubscribe' : 'Subscribe'}
                                </button>
                                <span>{videoData.views} views</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Playlist Section */}
                <div className="w-full md:w-1/3 overflow-y-auto bg-gray-100">
                    {videoObj.error && <ErrorPage />}
                    {videoObj.loading && <LoaderPage />}
                    {!videoObj.error &&
                        !videoObj.loading &&
                        videoObj.response.map((video) => (
                            <div
                                key={video._id}
                                onClick={() => handleClick(video._id)}
                                className="flex gap-2 p-2 bg-white hover:bg-gray-200 cursor-pointer"
                            >
                                <img
                                    className="w-24 h-16 rounded-md"
                                    src={video.thumbnail}
                                    alt="Thumbnail"
                                />
                                <div>
                                    <h2 className="text-sm font-medium">{video.title}</h2>
                                    <p className="text-xs text-gray-500">{video.fullName}</p>
                                    <p className="text-xs text-gray-500">{video.views} views</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {/* Comments Section */}
            <div className="p-4 bg-gray-100 w-full md:w-3/4 ">
                <h3 className="text-lg font-bold">Comments</h3>
                <CommentForm onAddComment={(comment) => setComments([...comments, comment])} />
                {comments.map((comment) => (
                    <AllComment key={comment._id} comment={comment} />
                ))}
            </div>
        </Container>
    );
}

export default Video;

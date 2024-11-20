import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import VideoPlayer from '../VideoPlayer';
import Container from '../container/Container';
import Footer from './Footer';
import Header from '../Header';
import UseReactQuery from '../../Custom_Hook/useReactQuery.js';
import AllComment from './AllComment';
import CommentForm from './CommentForm'
import ErrorPage from '../ErrorPage.jsx';
import LoaderPage from '../LoadingPage.jsx';

function Video() {
    const[isOwner, setIsOwner] = useState(false)
    const[curUser, setCurUser] = useState(null)
    const[subscribed, setSubscribed] = useState(false)
    const videoObj = UseReactQuery(`${import.meta.env.VITE_API_URL}/api/v1/videos/home-videos`, 'GET')
    const location = useLocation();
    const videoId = location.state;
    const videoInfo = UseReactQuery(`${import.meta.env.VITE_API_URL}/api/v1/videos/c/${videoId}`, 'GET')
    const userId = videoInfo?.response?.owner?._id;
    const [videoData, setVideoData] = useState(null);
    const token = useSelector(state => state.accessTokenSlice.token);
    const[comments, setComments] = useState([])
    const navigate = useNavigate()

    const handleClick = (videoId) => {
        navigate(`/v/${videoId}`, { state: videoId })
    }
    
    const onAddComment = useCallback(async (commentContent) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/comments/d/${videoId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({ content: commentContent })
            });

            if (!response.ok) {
                console.log("Something went wrong while adding a comment")
            } else {
                // Fetch the updated comments from the server after adding a new comment
                fetchComments();
            }
        } catch (error) {
            throw new Error(error)
        }
    }, [videoId, token]);

    const fetchVideoData = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/videos/c/${videoId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                mode: 'cors',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Server response is not ok");
            }

            const jsonResponse = await response.json();
            setVideoData(jsonResponse.data);
        } catch (error) {
            console.log(error);
            throw new Error("Something went wrong while fetching video from server");
        }
    }, [videoId, token]);

    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/comments/d/${videoId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                mode: 'cors',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Server response is not ok");
            }

            const jsonResponse = await response.json();
            setComments(jsonResponse.data);
        } catch (error) {
            console.log(error);
            throw new Error("Something went wrong while fetching video from server");
        }
    }, [videoId, token]);

    useEffect(() => {
        fetchVideoData();
        fetchComments();
    }, [fetchVideoData, fetchComments]);

    useEffect(() => {
        (
            async () => {
                try {
                    if (userId) {
                        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions/s/${userId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            mode: 'cors',
                            credentials: 'include',
                        });
        
                        if (response.ok) {
                            const data = await response.json();
                            setSubscribed(data.data); 
                        } else {
                            console.error('Failed to fetch subscription status');
                        }

                        response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/current-user`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            mode: 'cors',
                            credentials: 'include',
                        });

                        if (response.ok) {
                            const data = await response.json();
                            setCurUser(data?.data?._id)
                            if(curUser === userId) {
                                setIsOwner(true)
                            }
                        } else {
                            console.error('Failed to fetch current user');
                        }
                    }
                } catch (error) {
                    console.error('Error fetching subscription status:', error);
                }
            }
        )()
    }, [userId, token]);

    useEffect(() => {
        (
            async () => {
                try {
                    if (userId && curUser) {
                        if(userId === curUser) {
                            setIsOwner(true)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching current user:', error);
                }
            }
        )()
    }, [curUser]);

    const handleSubscribeButton = async () => {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions/c/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            mode: 'cors',
            credentials: 'include',
        });

        if(response.ok) {
            let response2 = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions/s/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                mode: 'cors',
                credentials: 'include',
            });

            if (response2.ok) {
                const data = await response2.json();
                setSubscribed(data.data); 
            } else {
                console.error('Failed to fetch subscription status');
            }
        }
    }

    return (
        <Container>
            <div className='flex flex-col items-center'>
                <Header />
            </div>
            <div className="w-full h-screen flex flex-wrap  justify-centee items-between p-3 shadow-lg">
                <div className='w-full md:w-1/2 overflow-y-auto scrollbar-none max-h-[100vh] shadow-2xl rounded-lg' >
                    
                    {
                        videoData &&
                        <div className="w-full bg-gray-200 rounded-lg p-4">
                            <VideoPlayer videoFile={videoData?.videoFile} />
                        </div>
                    }

                    {videoData && 
                        <div>
                            <Footer isOwner={isOwner} videoData={videoData} subscribed={subscribed} handleSubscribeButton={handleSubscribeButton} />
                        </div>
                    }

                    <div className=' w-full px-2 py-4 rounded-lg '>
                       {videoData?.description}
                    </div>

                    {/* Comments */}
                    <div className='p-3 mt-2 flex flex-wrap flex-col gap-4'>
                        <CommentForm onAddComment={onAddComment} comments={comments} />
                        {
                            comments?.map((comment) => (
                                <div key={comment._id}> <AllComment comment={comment} /> </div>
                            ))
                        }
                    </div>
                </div>
                <div className=' overflow-y-auto overflow-x-hidden max-h-[100vh] w-full md:w-1/2'>
                    {videoObj.error && <ErrorPage/>}
                    {videoObj.loading && <LoaderPage />}
                    {   
                        !videoObj.error && !videoObj.loading &&
                        videoObj.response.map((video) => (
                            <div key={video._id} onClick={() => handleClick(video._id)} className='p-2 flex flex-row justify-start gap-2 w-full h-32 bg-gray-100 m-2'>
                                    <img className='h-24 w-36 md:h-28 md:w-40 rounded-md' src={video.thumbnail} />

                                    <div >
                                        <h1 className='text-sm md:text-xl font-semibold'>{video.title}</h1>
                                        {/* channel owner */}
                                        <h1 className='text-sm md:text-xl text-gray-500'>{video.fullName}</h1>
                                        {/* views */}
                                        <p className='text-sm md:text-xl text-gray-500'>{video.views} views</p>
                                    </div>
                            </div>
                    ))}
                    
                </div>
            </div>
        </Container>
    );
}

export default Video;

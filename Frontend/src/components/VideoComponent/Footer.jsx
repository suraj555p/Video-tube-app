import React, { useCallback, useEffect, useState } from 'react'
import Button from '../Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useSelector } from 'react-redux';

function Footer({isOwner, videoData, subscribed, handleSubscribeButton}) {
    const[boolLike, setBoolLike] = useState(null)
    const[boolDisLike, setBoolDisLike] = useState(null)
    const token = useSelector(state => state.accessTokenSlice.token);
    const fetchLikeData = useCallback( async() => {
        const res = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/likes/boolLike/b/${videoData?._id}',
        {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
        if(!res.ok) {
            throw new Error("Something went wrong while fetching like information")
        }
        const jsonRes = await res.json()
        setBoolLike(jsonRes.data)
    })

    const fetchDislikeData = useCallback( async() => {
        const res = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/dislikes/dislikebool/b/${videoData?._id}',
        {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
        if(!res.ok) {
            throw new Error("Something went wrong while fetching dislike information")
        }
        const jsonRes = await res.json()
        setBoolDisLike(jsonRes.data)
    })

    const toggleLike = useCallback( async() => {
        const res = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/likes/toggle/v/${videoData?._id}',
        {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
        if(!res.ok) {
            throw new Error("Something went wrong while fetching liking video")
        }
        const jsonRes = await res.json()
        setBoolLike(jsonRes.data)
    })

    const toggleDisLike = useCallback( async() => {
        const res = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/dislikes/toggle/v/${videoData?._id}',
        {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
        if(!res.ok) {
            throw new Error("Something went wrong while fetching liking video")
        }
        const jsonRes = await res.json()
        setBoolDisLike(jsonRes.data)
    })

    useEffect(() => {
        fetchLikeData()
        fetchDislikeData()
    }, [toggleLike, toggleDisLike])

    const handleToggleLike = () => {
        if((boolDisLike == boolLike) || boolLike) {
            // both are not selected
            toggleLike()
        } 
        else {
            toggleLike()
            toggleDisLike()
        }
    }

    const handleToggleDislike = () => {
        if((boolDisLike == boolLike) || boolDisLike) {
            // both are not selected
            toggleDisLike()
        } else {
            toggleLike()
            toggleDisLike()
        }
    }

    return (
        <div className=" bg-gray-200 rounded-lg w-full px-4 pb-4">
            <p className="text-gray-500 font-bolder mb-1">Views - {videoData?.views}</p>
            <h1 className="text-md md:text-xl mb-3 font-semibold text-gray-900">{videoData?.title}</h1>
            <div className='pr-3 flex flex-wrap justify-between items-center'>
                <div className='flex flex-wrap gap-2 items-center justify-between'>
                    <img className='rounded-full h-10 w-10' src={videoData?.owner?.avatar} />
                    <h1 className='font-semibold'>{videoData?.owner?.username}</h1>
                </div>
                <div>
                    {
                        (!subscribed) ? (
                            <Button className='py-1 px-3 text-sm md:text-md ' onClick={
                                handleSubscribeButton
                            }>Subscribe</Button>
                        ) : (
                            <Button className='py-1 px-3 text-sm md:text-md' onClick = {
                                handleSubscribeButton
                            } bgColor="bg-gray-500" >Subscribed</Button>
                        )
                    }
                    
                </div>
            </div>
                <div className='flex flex-wrap justify-start items-center gap-1 mt-3'>
                    <div className='flex flex-wrap justify-center items-center gap-1'>
                        <div onClick={handleToggleLike} className='rounded-full text-xs px-4 py-1 md:text-lg md:px-6 md:py-2 bg-gray-300'>
                            <FontAwesomeIcon style={{color: (boolLike) ? 'blue' : 'black'}} icon={faThumbsUp} />
                        </div>
                        <div onClick={handleToggleDislike} className='rounded-full text-xs px-4 py-1 md:text-lg md:px-6 md:py-2 bg-gray-300'>
                            <FontAwesomeIcon style={{color: (boolDisLike) ? 'blue' : 'black'}} flip="horizontal" icon={faThumbsDown} />
                        </div>
                    </div>
                    {isOwner &&
                        <div className='flex flex-wrap gap-2'>
                            <FontAwesomeIcon className='text-blue-600 bg-gray-300 rounded-full text-xs px-4 py-1 md:text-lg md:px-6 md:py-2'  flip="horizontal" icon={faEdit} />
                            <FontAwesomeIcon className='bg-gray-300 text-red-600 rounded-full text-xs px-4 py-1 md:text-lg md:px-6 md:py-2' flip="horizontal" icon={faTrash} />
                        </div>
                    }
                </div>
        </div>
    )
}

export default Footer

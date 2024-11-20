import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

function AllComment({comment}) {
    const[user, setUser] = useState(null)
    const token = useSelector(state => state.accessTokenSlice.token);
    const[boolLike, setBoolLike] = useState(null)
    const[boolDisLike, setBoolDisLike] = useState(null)

    const fetchUser = useCallback(async() => {
        try {
            const response = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/users/user-by-id', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({ _id: comment?.owner })
            })

            if(!response) {
                throw new Error("Something went wrong while adding a comment")
            }

            const jsonResponse = await response.json()
            setUser(jsonResponse)
        } catch (error) {
            throw new Error(error)
        }
    }, [])

    const fetchLikeData = useCallback( async() => {
        const res = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/likes/boolComment/b/${comment?._id}',
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

    const fetchDisLikeData = useCallback( async() => {
        const res = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/dislikes/dislikecommentbool/b/${comment?._id}',
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
        const res = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/likes/toggle/c/${comment?._id}',
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
            throw new Error("Something went wrong while fetching comment toggle")
        }
        const jsonRes = await res.json()
        setBoolLike(jsonRes.data)
    })

    const toggleDisLike = useCallback( async() => {
        const res = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/dislikes/toggle/c/${comment?._id}',
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
            throw new Error("Something went wrong while fetching dislike toggle")
        }
        const jsonRes = await res.json()
        setBoolDisLike(jsonRes.data)
    })

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

    useEffect(() => {
        fetchLikeData()
        fetchDisLikeData()
    }, [toggleLike, toggleDisLike])

    useEffect(() => {
        fetchUser()
    }, [comment])

    return (
        <div className='flex flex-wrap justify-start w-full items-start gap-2 p-1 md:p-2'>
                <img className='w-10 h-10 rounded-full' src={user?.data?.avatar} alt='Profile'/>
                <div className=''>
                    <div >
                        <h1 className='text-gray-400'>{user?.data?.username}</h1>
                        <p>{comment?.content}</p>
                    </div>
                    <div className='flex flex-wrap justify-start items-center gap-3'>
                        <div onClick={handleToggleLike} className='rounded-full text-xs px-4 py-1 md:text-lg md:px-6 md:py-2 bg-gray-300'>
                            <FontAwesomeIcon style={{color: (boolLike) ? 'blue' : 'black'}} icon={faThumbsUp} />
                        </div>
                        <div onClick={handleToggleDislike} className='rounded-full text-xs px-4 py-1 md:text-lg md:px-6 md:py-2 bg-gray-300'>
                            <FontAwesomeIcon style={{color: (boolDisLike) ? 'blue' : 'black'}} flip="horizontal" icon={faThumbsDown} />
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default AllComment

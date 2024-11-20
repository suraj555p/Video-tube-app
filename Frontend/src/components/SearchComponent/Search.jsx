import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorPage from '../ErrorPage';
import LoaderPage from '../LoadingPage';

function Search() {
    const navigate = useNavigate()
    const location = useLocation();
    const searchResult = location.state.data.videos;

    const handleClick = (videoId) => {
        navigate(`/v/${videoId}`, { state: videoId })
    }

    return (
        <div className="flex flex-col items-center">
            <Header />
            <div className='max-h-[100vh] w-full'>
                {searchResult.error && <ErrorPage />}
                {searchResult.loading && <LoaderPage />}
                {!searchResult.error && !searchResult.loading && (
                searchResult.map((video) => (
                <div key={video._id} onClick={() => handleClick(video._id)} className='p-4 flex gap-4 items-center bg-gray-200 mt-2 mb-1 hover:bg-gray-300 rounded-md cursor-pointer transition duration-300 ease-in-out'>
                    <img className='h-24 w-36 md:h-28 md:w-40 rounded-md' src={video.thumbnail} alt={video.title} />

                    <div className="flex flex-col justify-center">
                        <h1 className='text-sm md:text-xl font-semibold'>{video.title}</h1>
                        <h1 className='text-sm md:text-xl text-gray-500'>{video.description}</h1>
                        <p className='text-sm md:text-xl text-gray-500'>{video.views} views</p>
                    </div>
                </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default Search;

import React, { useEffect } from 'react';
import { NavLink, json } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { setTokenWithExpiry } from '../store/accessTokenSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faClockRotateLeft, faUpload, faRightFromBracket, faUserPlus, faDownLeftAndUpRightToCenter, faArrowLeftRotate, faArrowLeft, faArrowsLeftRightToLine } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

function Header() {
    const [searchInput, setSearchInput] = useState("");
    const [userStatus, setUserStatus] = useState(null); 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                let expiry = JSON.parse(localStorage.getItem("accessToken"));
                if(expiry && new Date().getTime() < expiry) {
                    setUserStatus(true);
                } else {
                    const response = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/users/verification', {
                        method: 'GET',
                        mode: 'cors',  
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                    });

                    if (response.ok) {
                        const jsonResponse = await response.json();
                        if(jsonResponse.data.isAuthenticated) {
                            dispatch(setTokenWithExpiry({ttl: 30000}));
                            setUserStatus(true);
                        } else {
                            setUserStatus(false);
                        }
                    } else {
                        dispatch(logout());
                        setUserStatus(false);
                    }
                            
                }    
            } catch (error) {
                console.error('Error checking user status:', error);
                dispatch(logout());
                setUserStatus(false); 
            }
        };
    
        checkUserStatus();
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {    
            const validSearchInput = JSON.stringify({ searchInput });
            const response = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/search/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                body: validSearchInput,
            });
        
            if (!response.ok) {
                console.log('Something went wrong');
            }
        
            const searchResult = await response.json();
            navigate(`/search/videos`, { state: searchResult });
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong');
        }
    };

    const handleInput = (e) => {
        setSearchInput(e.target.value);
    };
    

    return (
        <div className='w-full shadow-lg flex flex-col justify-center items-center'>

            <form onSubmit={handleSubmit} className="w-full md:w-1/2 mt-2 mb-2 md:mb-4 flex justify-center items-center">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-3/4 py-1 md:py-2 px-4 rounded-l-full border border-gray-300 focus:outline-none focus:border-blue-500"
                    name='content'
                    value={searchInput}
                    onChange={handleInput}
                />
                <input className="bg-blue-500 text-white py-1 md:py-2 px-4 rounded-r-full" type='submit' value='Search' />
            </form>

            <div className="flex mb-3">
                <ul className="flex gap-8 font-semibold">
                    
                    {userStatus === true && (
                        <>
                        <li>
                            <NavLink
                                to={"/"}
                                className={({isActive}) =>
                                    `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-blue-500" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-700 lg:p-0`
                                }
                            >
                                <FontAwesomeIcon icon={faHome} />
                            </NavLink>
                        </li>
                            <li>
                                <NavLink
                                    to={"/profile"}
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-blue-500" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-700 lg:p-0`
                                    }
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to={"/history"}
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-blue-500" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-700 lg:p-0`
                                    }
                                >
                                    <FontAwesomeIcon icon={faClockRotateLeft} />                                    
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to={"/upload"}
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-blue-500" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-700 lg:p-0`
                                    }
                                >
                                    <FontAwesomeIcon icon={faUpload} />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to={"/logout"}
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-blue-500" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-700 lg:p-0`
                                    }
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} />
                                </NavLink>
                            </li>
                        </>
                    )}
                    {!userStatus && (
                        <>
                            <li>
                                <NavLink
                                    to={"/login"}
                                    className="bg-gray-400 px-4 py-1.5 md:py-2 block rounded-2xl text-sm text-white"
                                >
                                    Sign-In / Sign-Up
                                </NavLink>
                            </li>
                            {/* <li>
                                <NavLink
                                    to={"/register"}
                                    className="bg-blue-500 px-4 py-2 block rounded-2xl text-sm text-white"
                                >
                                    SignUp
                                </NavLink>
                            </li> */}
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Header;

import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { setTokenWithExpiry } from '../store/accessTokenSlice';

function Header() {
    const [searchInput, setSearchInput] = useState("");
    const [userStatus, setUserStatus] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                let expiry = JSON.parse(localStorage.getItem("accessToken"));
                if (expiry && new Date().getTime() < expiry) {
                    setUserStatus(true);
                } else {
                    const response = await fetch(
                        'https://videotube-server-kmvo.onrender.com/api/v1/users/verification',
                        {
                            method: 'GET',
                            mode: 'cors',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                        }
                    );

                    if (response.ok) {
                        const jsonResponse = await response.json();
                        if (jsonResponse.data.isAuthenticated) {
                            dispatch(setTokenWithExpiry({ ttl: 30000 }));
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
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validSearchInput = JSON.stringify({ searchInput });
            const response = await fetch(
                'https://videotube-server-kmvo.onrender.com/api/v1/search/videos',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    credentials: 'include',
                    body: validSearchInput,
                }
            );

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
        <header className="w-full bg-black text-white">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center py-3 px-4">
                {/* Search Bar */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full md:w-auto flex items-center mb-3 md:mb-0 md:flex-grow md:justify-center"
                >
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full md:w-1/2 max-w-md py-1 px-4 text-sm border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
                        name="content"
                        value={searchInput}
                        onChange={handleInput}
                    />
                    <button
                        type="submit"
                        className="bg-gray-500 text-white py-1 px-4 text-sm rounded-r-full"
                    >
                        Search
                    </button>
                </form>

                {/* Sign-In Button */}
                {!userStatus && (
                    <NavLink
                        to="/login"
                        className="bg-gray-400 px-4 py-1.5 text-sm rounded-lg hover:bg-gray-500"
                    >
                        Sign-In
                    </NavLink>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="w-full bg-black py-2">
                <ul className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
                    {userStatus && (
                        <>
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `block py-2 px-3 ${
                                            isActive
                                                ? 'text-blue-500'
                                                : 'text-white hover:text-blue-300'
                                        }`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `block py-2 px-3 ${
                                            isActive
                                                ? 'text-blue-500'
                                                : 'text-white hover:text-blue-300'
                                        }`
                                    }
                                >
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/history"
                                    className={({ isActive }) =>
                                        `block py-2 px-3 ${
                                            isActive
                                                ? 'text-blue-500'
                                                : 'text-white hover:text-blue-300'
                                        }`
                                    }
                                >
                                    History
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/upload"
                                    className={({ isActive }) =>
                                        `block py-2 px-3 ${
                                            isActive
                                                ? 'text-blue-500'
                                                : 'text-white hover:text-blue-300'
                                        }`
                                    }
                                >
                                    Upload
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/logout"
                                    className={({ isActive }) =>
                                        `block py-2 px-3 ${
                                            isActive
                                                ? 'text-blue-500'
                                                : 'text-white hover:text-blue-300'
                                        }`
                                    }
                                >
                                    Logout
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;

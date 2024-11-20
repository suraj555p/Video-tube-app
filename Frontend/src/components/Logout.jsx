import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { deleteATLS } from "../store/accessTokenSlice"
import { useDispatch } from "react-redux"
import { logout } from "../store/authSlice"
import Header from "./Header"

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const logoutResponse = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/users/logout', {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                });
        
                if (logoutResponse.ok) {
                    console.error("Logout successfully");
                } else {
                    console.error('Error during logout:');
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
            dispatch(deleteATLS());
            dispatch(logout())
            localStorage.removeItem("accessToken");
            navigate("/");
        };
        handleLogout();
    })

    return (
        <>
            <Header/>
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-75 flex justify-center items-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        </>
    )
}

export default Logout

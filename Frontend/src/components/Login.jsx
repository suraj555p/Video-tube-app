import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { storeATLS, setTokenWithExpiry } from '../store/accessTokenSlice';
import { login } from '../store/authSlice';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[userErrMessage, setUserErrMessage] = useState("");
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData),
      });

      const dataFromServer = await response.json();

      if(!dataFromServer.success) {
        setUserErrMessage(dataFromServer?.data?.userError);
        return;
      }

      const accessToken = dataFromServer.data.accessToken;
      dispatch(setTokenWithExpiry({ttl: 30000}));
      dispatch(storeATLS(accessToken));
      dispatch(login())
      // localStorage.setItem("Access Token", JSON.stringify(accessToken));
      navigate('/');

    } catch (error) {
      console.log(error);
      throw new Error('Something went wrong while login');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex flex-col h-screen justify-center items-center bg-softBlue text-xs md:text-lg">
      { 
        loading &&
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-75 flex justify-center items-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div> 
      }
      <div onClick={() => navigate("/")} className='rounded-full px-6 py-1 bg-gray-300 absolute top-5 left-5'>
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>

      <div className="bg-gray-200 p-10 rounded-lg shadow-md ">
        <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-5">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-gray-700 font-semibold">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={loginData.username}
              onChange={handleInput}
              className="py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={loginData.password}
              onChange={handleInput}
              className="py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {userErrMessage?.length > 0 && <span className='text-red-500 text-xs pb-2 '>{userErrMessage}</span>}
          {userErrMessage?.length === 0 && <span className='pb-2'></span>}

          <button
            type="submit"
            className="bg-black text-white font-semibold py-2 px-4 rounded-md  transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-5">
          <span className="text-gray-700">Don't have an account?</span>{' '}
          <Link to="/register" className="text-blue-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

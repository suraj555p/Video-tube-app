import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { storeATLS, setTokenWithExpiry } from '../store/accessTokenSlice';
import { login } from '../store/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Register() {
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
  const [usernameErrMessage, setUsernameErrMessage] = useState('');
  const [fullNameErrMessage, setFullNameErrMessage] = useState('');
  const [emailErrMessage, setEmailErrMessage] = useState('');
  const [passwordErrMessage, setPasswordErrMessage] = useState('');
  const dispatch = useDispatch();
  const [register, setRegister] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    avatar: null,
  });

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    setRegister((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);

    const formData = new FormData();
    Object.entries(register).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/users/register', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: formData,
      });

      const dataFromServer = await response.json();

      if (!dataFromServer.success) {
        setUsernameErrMessage(dataFromServer?.data?.usernameError);
        setFullNameErrMessage(dataFromServer?.data?.fullNameError);
        setEmailErrMessage(dataFromServer?.data?.emailError);
        setPasswordErrMessage(dataFromServer?.data?.passwordError);
        return;
      }

      dispatch(setTokenWithExpiry({ ttl: 30000 }));
      dispatch(storeATLS(dataFromServer.data.accessToken));
      dispatch(login());
      navigate('/upload-avatar');
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-softBlue flex flex-col items-center justify-center px-4">
      {registering && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 bg-gray-300 p-3 rounded-full cursor-pointer"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>

      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-screen-sm">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-5 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-gray-700 font-semibold">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={register.username}
              onChange={handleInput}
              className="py-2 px-4 rounded-md border border-gray-400 focus:outline-none w-full focus:border-blue-500"
            />
            {usernameErrMessage && <span className="text-red-500 text-sm">{usernameErrMessage}</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="fullName" className="text-gray-700 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={register.fullName}
              onChange={handleInput}
              className="py-2 px-4 rounded-md border border-gray-400 focus:outline-none w-full focus:border-blue-500"
            />
            {fullNameErrMessage && <span className="text-red-500 text-sm">{fullNameErrMessage}</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={register.email}
              onChange={handleInput}
              className="py-2 px-4 rounded-md border border-gray-400 focus:outline-none w-full focus:border-blue-500"
            />
            {emailErrMessage && <span className="text-red-500 text-sm">{emailErrMessage}</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={register.password}
              onChange={handleInput}
              className="py-2 px-4 rounded-md border border-gray-400 focus:outline-none w-full focus:border-blue-500"
            />
            {passwordErrMessage && <span className="text-red-500 text-sm">{passwordErrMessage}</span>}
          </div>

          <button
            type="submit"
            className="bg-black text-white font-semibold py-2 px-4 rounded-md  w-full"
          >
            Submit
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-700">Already have an account? </span>
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

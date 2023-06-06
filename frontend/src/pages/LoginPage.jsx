import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);
  const loginUser = async () => {
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="h-screen bg-blue-200 flex items-center justify-center">
      <div className="bg-white shadow-md p-5 flex flex-col gap-4 w-96 rounded-xl">
        <h1 className="text-3xl text-black uppercase">Login</h1>
        <hr />

        <input
          type="email"
          value={email}
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
          className=""
        />
        <input
          type="password"
          value={password}
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          className=""
        />

        <button
          type="button"
          className="contained-btn"
          onClick={loginUser}
          disabled={isLoading}
        >
          Login
        </button>
        {isLoading && <Loader />}
        <p>
          Not a member?{' '}
          <Link to="/register" className="underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

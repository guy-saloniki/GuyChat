import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading, error }] = useRegisterMutation();

  const registerUser = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate('/login');
        toast.success('User created successfully!');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };
  return (
    <div className="h-screen bg-blue-200 flex items-center justify-center">
      <div className="bg-white shadow-md p-5 flex flex-col gap-4 w-96 rounded-xl">
        <h1 className="text-3xl text-black uppercase">Register</h1>
        <hr />
        <input
          type="text"
          value={name}
          placeholder="Enter Name"
          onChange={(e) => setName(e.target.value)}
          className=""
        />
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
        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className=""
        />
        <button type="button" className="contained-btn" onClick={registerUser}>
          Register
        </button>
        <p>
          {isLoading && <Loader />}
          Already a member?{' '}
          <Link to="/login" className="underline">
            login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

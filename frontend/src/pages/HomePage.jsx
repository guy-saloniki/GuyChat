import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaComments, FaUser, FaArrowRight } from 'react-icons/fa';
import UserSearch from '../components/UserSearch';
import ChatArea from '../components/ChatArea';
import UsersList from '../components/UsersList';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Join room
    socket.emit('join-room', userInfo._id);
  }, []);

  const HandleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logoutApiCall().unwrap();
        dispatch(logout());
        navigate('/login');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100">
      {/* header */}
      <div className="flex justify-between p-5">
        <div className="flex items-center justify-center gap-1">
          <FaComments className="text-3xl text-cyan-900" />
          <h1 className="text-cyan-900 text-2xl uppercase font-semibold">
            GUYCHAT
          </h1>
        </div>
        <div className="flex items-center justify-center gap-1">
          <FaUser className="text-md text-cyan-900" />
          <h1 className="text-xl underline">{userInfo.name}</h1>
          <FaArrowRight
            className="ml-5 text-xl cursor-pointer transition duration-300 hover:-translate-y-1 hover:scale-110"
            onClick={HandleLogout}
          />
        </div>
      </div>

      {/* main */}
      <div className="flex ml-8 gap-5">
        {/* user search, user list */}
        <div className="w-96">
          <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <UsersList searchTerm={searchTerm} />
        </div>
        {/* chat area */}
        {selectedChat && (
          <div className="w-full">
            <ChatArea socket={socket} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { useSelector } from 'react-redux';
import { FaComments, FaUser } from 'react-icons/fa';

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
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
        </div>
      </div>
      {/* main */}
      <div>Home</div>
    </div>
  );
};

export default HomePage;

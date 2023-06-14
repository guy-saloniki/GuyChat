import React, { useState } from 'react';

const UserSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for user..."
        className="rounded-full w-full border-gray-200 text-gray-500 h-14"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default UserSearch;

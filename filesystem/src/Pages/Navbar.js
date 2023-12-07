import React from "react";

const Navbar = ({ userName }) => {
  return (
    <div className="flex justify-end bg-gray-800 p-4 text-white">
      <div>{userName}</div>
    </div>
  );
};

export default Navbar;

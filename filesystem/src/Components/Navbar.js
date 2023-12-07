import React from "react";

const Navbar = () => {
  return (
    <>
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-white font-bold text-xl">Seepossible</div>
        <div className="flex items-center space-x-2 text-white">
          <div className="w-8 h-8 bg-gray-400 rounded-full flex justify-center items-center">
            👨‍🦱
          </div>
          <div className="text-lg font-semibold">Mitulkumar Savaliya</div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

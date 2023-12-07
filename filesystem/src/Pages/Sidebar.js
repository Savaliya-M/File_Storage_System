import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ length }) => {
  return (
    <div className="bg-gray-800 text-white h-screen w-1/5">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
        <ul>
          {length === 1 ? (
            <li className="mb-2">
              <Link
                to="/dashboard/notes"
                className="text-gray-300 hover:text-white"
              >
                Notes
              </Link>
            </li>
          ) : (
            <>
              <li className="mb-2">
                <Link
                  to="/dashboard/notes"
                  className="text-gray-300 hover:text-white"
                >
                  Notes
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/dashboard/todo"
                  className="text-gray-300 hover:text-white"
                >
                  Todo
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

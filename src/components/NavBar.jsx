import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Water Level Monitor</h1>

      <ul className="flex space-x-6">
        <li className="hover:text-gray-300 cursor-pointer">Home</li>
        <li className="hover:text-gray-300 cursor-pointer">All Record</li>
      </ul>
    </nav>
  );
};  

export default Navbar;

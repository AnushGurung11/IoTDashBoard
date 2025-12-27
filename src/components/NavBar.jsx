// import React from "react";

// const Navbar = () => {
//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
//       <h1 className="text-xl font-semibold">Water Level Monitor</h1>

//       <ul className="flex space-x-6">
//         <li className="hover:text-gray-300 cursor-pointer">Home</li>
//         <li className="hover:text-gray-300 cursor-pointer">All Record</li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

import { Home, Database } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
              <svg
                className="w-7 h-7 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Water Level Monitor
              </h1>
              <p className="text-xs text-blue-100">Real-time IoT System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-2">
            <li>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 hover:text-black transition-all duration-200 text-blue-50">
                <Home size={18} />
                <span className="font-medium">
                  <Link to="/">Home</Link>
                </span>
              </button>
            </li>
            <li>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 hover:text-black transition-all duration-200 text-blue-50">
                <Database size={18} />
                <span className="font-medium">
                  <Link to="/allrecords">All Records</Link>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

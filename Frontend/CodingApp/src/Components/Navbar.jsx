import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
// Mock login state (replace with your auth logic)


const navItems = [
  { name: "Home", link: "/" },
  { name: "Contests", link: "/contests" },
  { name: "Contact Us", link: "/contact" },
  { name: "About Us", link: "/about" },
  {name : "Contests Results", link: "/completedContest"}
];

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const { logout } = useAuth();
  return (
    <div className="py-4 fixed top-0 z-50 bg-white w-full shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {/* Logo */}
          <Link to="/" className="text-xl font-extrabold text-blue-800 tracking-tight">
            VinCode
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link to={item.link} className="text-blue-800 font-medium text-lg hover:underline">
                  {item.name}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <>
              <li>
                <Link to="/profile" className="text-blue-800 font-medium text-lg hover:underline">
                  Profile
                </Link>
                </li>
                <li>
                <button className="text-blue-800 font-medium text-lg hover:underline" onClick={logout}>Logout</button>
              </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-blue-800 font-medium text-lg hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-blue-800 font-medium text-lg hover:underline">
                    SignUp
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu */}
          <div className="dropdown dropdown-end md:hidden ml-auto">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="text-blue-800 text-lg">
                    {item.name}
                  </Link>
                </li>
              ))}
              {isLoggedIn ? (
                <li>
                  <Link to="/profile" className="text-blue-800 text-lg">
                    Profile
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-blue-800 text-lg">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="text-blue-800 text-lg">
                      SignUp
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

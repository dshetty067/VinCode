import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Contests", link: "/contests" },
  { name: "Results", link: "/completedContest" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
];

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="vincode-header">
      <div className="vincode-nav-inner">
        <Link to="/" className="vincode-brand" onClick={closeMenu}>
          <span className="vincode-brand-mark" aria-hidden="true" />
          VinCode
        </Link>

        <button
          type="button"
          className="vincode-menu-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav
          className={`vincode-nav-links${menuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="vincode-nav-link"
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="vincode-nav-link"
                onClick={closeMenu}
              >
                Profile
              </Link>
              <button
                type="button"
                className="vincode-nav-link"
                onClick={() => {
                  closeMenu();
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="vincode-nav-link"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="vincode-nav-link vincode-nav-action"
                onClick={closeMenu}
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

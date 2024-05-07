import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Ensure this path is correct
import "./styles.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Use the auth context
  const navigate = useNavigate(); // For redirecting after logout

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
    setIsMenuOpen(false); // Optionally close the menu
  };

  // Function to determine the active class
  const getActiveClass = ({ isActive }) => isActive ? "active" : "";

  return (
    <nav className="nav">
      <span>Weather</span>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="line">=</span>
      </div>
      <ul className={isMenuOpen ? "open" : ""}>
        <li>
          <NavLink to="/" className={getActiveClass}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={getActiveClass}>
            About
          </NavLink>
        </li>
        {user ? (
          <>
            <li>
              <NavLink to="/preferences" className={getActiveClass}>
                Preferences
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} style={{ all: 'unset', cursor: 'pointer' }}>
                Log Out
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={getActiveClass}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

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

  return (
    <nav className="nav">
      <div className="nav-left">
        {user ? (
          <span className="user-greeting">Hey, {user.username}!</span>
        ) : (
          <span>Weather</span>
        )}
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="line">=</span>
      </div>
      <ul className={isMenuOpen ? "open" : ""}>
        <li>
          <NavLink to="/" activeClassName="active" exact>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" activeClassName="active">
            About
          </NavLink>
        </li>
        {user ? (
          <>
            <li>
              <NavLink to="/preferences" activeClassName="active">
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
            <NavLink to="/login" activeClassName="active">
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

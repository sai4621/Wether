import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./styles.css";
import LoginPage from "./LoginPage"; // Add missing import statement

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav">
      <span>Weather</span>
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
        <li>
          <NavLink to="/login" activeClassName="active">
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

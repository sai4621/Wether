import React, { useState } from "react";
import "./styles.css";

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
          Home
        </li>
        <li>
          About
        </li>
        <li>
          Contact
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

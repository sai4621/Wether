import React, { useState } from "react";
import "./styles.css";
import LoginPage from "./LoginPage"; // Add missing import statement
import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>

      <nav className="nav">
        <span>Weather</span>
        <div className="hamburger" onClick={toggleMenu}>
          <span className="line">=</span>
        </div>
        <ul className={isMenuOpen ? "open" : ""}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            About
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
              <Routes>
              <Route path="/login" element={<LoginPage />} />
              </Routes>
              </Router>
  );
};

export default Navbar;

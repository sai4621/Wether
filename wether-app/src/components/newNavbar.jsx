import { NavLink } from "react-router-dom";
import "./styles.css"; 

const Navbar = () => {
  return (
    <header className='header'>
      <nav className='nav'>
        <NavLink to='/' className="logo">
          Wether
        </NavLink>
        <NavLink to='/home' className="nav-link">
          Home
        </NavLink>
        <NavLink to='/about' className="nav-link">
          About
        </NavLink>
        <NavLink to='/login' className="nav-link">
          Login
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;

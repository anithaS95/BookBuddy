import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { notifySuccess } from '../../toastConfig';
import userIcon from '../../images/user_icon.png'; // Replace with actual user icon image
import { useTheme } from '../../themeContext'; // Import useTheme hook

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Use the useTheme hook to get theme state and toggle function

  const handleNavbar = () => setToggleMenu(!toggleMenu);

  const handleLogout = () => {
    // Perform logout actions here, like clearing user data from local storage
    localStorage.removeItem('user');
    notifySuccess("Logout successfully");
    navigate('/login'); // Redirect to login page
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className={`navbar ${theme}`} id="navbar"> {/* Apply theme class */}
      <div className='container navbar-content flex'>
        <div className='brand-and-toggler flex flex-sb'>
          <Link to="/" className='navbar-brand flex'>
            <img src={''} alt="logo" />
            <span className='text-uppercase fw-7 fs-24 ls-1'>bookbuddy</span>
          </Link>
          <button type="button" className='navbar-toggler-btn' onClick={handleNavbar}>
            <HiOutlineMenuAlt3 size={35} style={{
              color: `${toggleMenu ? "#fff" : "#010101"}`
            }} />
          </button>
        </div>

        <div className={toggleMenu ? "navbar-collapse show-navbar-collapse" : "navbar-collapse"}>
          <ul className="navbar-nav">
            <li className='nav-item'>
              <Link to="book" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Book</Link>
            </li>
            <li className='nav-item'>
              <button onClick={handleLogout} className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Logout</button>
            </li>
            <li className='nav-item'>
              <button onClick={toggleTheme} className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>
                Theme ({theme === 'light' ? 'Dark' : 'Light'})
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

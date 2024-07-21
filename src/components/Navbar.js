// src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import Popup from './Popup';
import './Navbar.css';
import { UserAuth } from './authContext';

function Navbar() {
  const { user, googleSignIn, logOut, loading } = UserAuth();
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const togglePopup = () => setShowPopup(!showPopup);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  if (!user) {
    return (
      <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            spent.
            <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>

            <li>
              <Link
                to='/tutorials'
                className='nav-links-mobile'
                onClick={handleSignIn}
              >
                SIGN UP
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline' onClick={handleSignIn}>SIGN UP</Button>}
          
        </div>
      </nav>
      {showPopup && <Popup togglePopup={togglePopup} />}
    </>
    );
  }

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            spent.
            <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/services'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Session History
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/ProfilePage'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
            </li>

            <li>
              <Link
                to='/tutorials'
                className='nav-links-mobile'
                onClick={handleSignOut}
              >
                SIGN OUT
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline' onClick={handleSignOut}>SIGN OUT</Button>}
          
        </div>
      </nav>
      {showPopup && <Popup togglePopup={togglePopup} />}
    </>
  );
}

export default Navbar;

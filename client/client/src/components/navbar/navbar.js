import React from 'react';
import './navbar.css';

const NavBar = (props) => {
  return (
    <div className="nav">
        <input type="checkbox" id="nav-check" />
        <div className="nav-header">
            <div className="nav-title">
            ArbiLex
            </div>
        </div>
        <div className="nav-btn">
            <label htmlFor="nav-check">
            <span></span>
            <span></span>
            <span></span>
            </label>
        </div>
        
        <div className="nav-links">
            <a href="/">Main</a>
            <a href="/dash">Dash</a>
            <a href="/dash">Aggregate Detail</a>
        </div>
    </div>
  );
};
 
export default NavBar;
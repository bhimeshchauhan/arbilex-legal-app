import React from 'react';
import './navbar.css';
import { NavLink } from 'react-router-dom';

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
            <NavLink exact to="/" activeClassName="active">Main</NavLink>
            <NavLink exact to="/dash" activeClassName="active">Dash</NavLink>
        </div>
    </div>
  );
};
 
export default NavBar;
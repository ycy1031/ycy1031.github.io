import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <header className="navbar-container">
      <div className="navbar-logo-box">
        <Link to="/" className="navbar-logo">My-ToDo</Link>
      </div>
      <nav className="nav-bar">
        <Link to="/today">Today</Link>
        <Link to="/history">History</Link>
        <Link to="/important">Importants</Link>
        <Link to="/stats">Stats</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </header>
  );
}

export default Navbar;

import React, {useContext} from "react";

import { Link } from "react-router-dom";

import $ from "jquery";
import Popper from "popper.js";

import AuthContext from "../../context/auth-context";

import "./Navbar.css";
import "../Layout/Layout.css"; // reason for this is to get all global variables (colors, font weights, etc...)
const Navbar = (props) => {
  const auth = useContext(AuthContext);

  // Note: Navbar responsive functionality does not work. (i.e when sizing down the width of the screen, a hamburger button appears, but clicking on it does nothing)
  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <h1 className="brand">
          <Link to="/" className="navbar-brand">TM</Link>
        </h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"y
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* mx-auto isn't the right class for the spacing I want, will fix it later. -Victoire */}
          <div className="search-bar mx-auto col-md-6 col-lg-4"> 
          <form className="d-flex">
            <div className="input-group">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search games, game assets..."
              aria-label="Search"
            />
            </div>
        
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          </div>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0  ">
            <li className="nav-item">
            {auth.isLoggedIn && (
              <li className="nav-item">
              <Link className="nav-link" to="/signup">My account</Link>
            </li>
            )}
              <Link className="nav-link" to="/login">Log in</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Sign up</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

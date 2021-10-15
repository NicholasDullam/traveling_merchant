import React, {useContext} from "react";

import { Link } from "react-router-dom";

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

import AuthContext from "../../context/auth-context";

import "./Navbar.css";
import "../Layout/Layout.css"; // reason for this is to get all global variables (colors, font weights, etc...)
import SearchBar from "../SearchBar/SearchBar";
const Navbar = (props) => {
  const auth = useContext(AuthContext);

console.log(auth.isLoggedIn)

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
          <SearchBar/>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0  ">
          {(auth.isLoggedIn && 
          <React.Fragment>
            { auth.user.admin ? <li className="nav-item">
              <Link className="nav-link" to="/messages">Admin</Link>
            </li> : null }
            <li className="nav-item">
              <Link className="nav-link" to="/messages">Messages</Link>
            </li>
            <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#">
            <Link  to="/account_info">Account info</Link>
              </a></li>
              <li><a class="dropdown-item" href="#">
            <Link  to="/favorites">Favorites</Link>
              </a></li>
              <li><a class="dropdown-item" href="#">
            <Link  to="/review">Review</Link>
              </a></li>
              <li><a class="dropdown-item" href="#">
            <Link  to="/viewing_history">Viewing History</Link>
              </a></li>
              <li><a class="dropdown-item" href="#">
            <Link  to="/orders">Orders</Link>
              </a></li>
              <li><a class="dropdown-item" href="#">
            <Link  to="/preferences">Preferences</Link>
              </a></li>
              <li><a class="dropdown-item" href="#">
            <Link  to="/signout">Sign out</Link>
              </a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"/></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        </React.Fragment>)}
            
           {(!auth.isLoggedIn &&
           <React.Fragment>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Log in</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Sign up</Link>
            </li>
            </React.Fragment>)}

          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

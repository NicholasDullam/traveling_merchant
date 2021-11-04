import React, {useContext} from "react";

import { Link } from "react-router-dom";

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

import AuthContext from "../../context/auth-context";

import { FaBell } from "react-icons/fa";

import MessengerContext from "../../context/messenger-context";

import "./Navbar.css";
import "../Layout/Layout.css"; // reason for this is to get all global variables (colors, font weights, etc...)
import SearchBar from "../SearchBar/SearchBar";
import api from "../../api";
import NotificationContext from "../../context/notification-context";

const Navbar = (props) => {
  const auth = useContext(AuthContext);
  const messenger = useContext(MessengerContext)
  const notifications = useContext(NotificationContext)

  const handleLogout = () => {
    api.logout().then((response) => {
      auth.logout()
    }).catch((error) => {
      console.log(error)
    })
  }

//   useEffect(() => {
//     api.getUserById(user_id).then((response) => {
//         setUser(response.data)
//     }).catch((error) => {
//         console.log(error)
//     })
// }, [])

const displayNotifications = () => {
api.getNotifications().then((response)=> {
  console.log(response.data)
})
}

  // Note: Navbar responsive functionality does not work. (i.e when sizing down the width of the screen, a hamburger button appears, but clicking on it does nothing)
  return (
    <nav className="navbar navbar-expand-md" style={{ position: 'fixed', top: '0px', width: '100%', zIndex: '2' }}>
      <div className="container-fluid" style={{ alignItems: 'center' }}>
        <h1 className="brand" style={{ marginBottom: '8px', marginTop: '-8px', marginLeft: '10px'}}>
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
          {(auth.isLoggedIn && auth.user && 
          <React.Fragment>
            { auth.user.admin ? <li className="nav-item">
              <Link className="nav-link" to="/admin/users">Admin</Link>
            </li> : null }
            <li className="nav-item" onClick={() => {
              if (notifications.isOpen) notifications.close()
              if (!notifications.isOpen) notifications.open()
            }}>
              <p style={{ marginBottom: '0px' }} className="nav-link" to="/messages">Notifications</p>
            </li>
            <li className="nav-item" onClick={() => {
              if (messenger.isOpen) messenger.close()
              if (!messenger.isOpen) messenger.open()
            }}>
              <p style={{ marginBottom: '0px' }} className="nav-link" to="/messages">Messages</p>
            </li>
            <li>
              <div class="dropdown" >
            <a  class=" dropdown-toggle"
            id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <FaBell
            style={{color: 'white'}}/>
            <Badge count={5}></Badge>

            </a>


            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
  </ul>            </div>
              </li>
            <li class="nav-item dropdown" style={{ marginLeft: '20px' }}>
          <a class="nav-link" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={auth.user.profile_img} style={{ height: '30px', width: '30px', borderRadius: '50%' }}/>
          </a>
          <ul style={{ transform: 'translateX(-115px) translateY(10px)' }} class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item">
            <Link to="/profile/info">Account info</Link>
              </a></li>
              <li><a class="dropdown-item">
            <Link  to="/profile/favorites">Favorites</Link>
              </a></li>
              <li><a class="dropdsown-item">
            <Link  to="/profile/reviews">Review</Link>
              </a></li>
              <li><a class="dropdown-item">
            <Link  to="/profile/views">Viewing History</Link>
              </a></li>
              <li><a class="dropdown-item">
            <Link  to="/profile/orders">Orders</Link>
              </a></li>
              {auth.user.acct_id ? <li><a class="dropdown-item">
            <Link  to="/profile/products">Products</Link>
              </a></li> : null }
              <li><a class="dropdown-item">
            <Link  to="/profile/billing">Billing</Link>
              </a></li>
              <li><a class="dropdown-item">
            <Link  to="/profile/preferences">Preferences</Link>
              </a></li>
              <li onClick={handleLogout}><a class="dropdown-item">
            <Link  to="/">Sign out</Link>
              </a></li>
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

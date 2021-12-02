import React, { useContext, useEffect, useRef, useState } from "react";

import { Link, useHistory, useLocation } from "react-router-dom";

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

import AuthContext from "../../context/auth-context";

import MessengerContext from "../../context/messenger-context";

import "./Navbar.css";
import "../Layout/Layout.css"; // reason for this is to get all global variables (colors, font weights, etc...)
import SearchBar from "../SearchBar/SearchBar";
import api from "../../api";
import NotificationContext from "../../context/notification-context";
import { IoIosNotifications } from 'react-icons/io'
import { RiMessage3Fill } from 'react-icons/ri'

const NavElement = (props) => {
    return (
        <div onClick={props.onClick} style={{ margin: '10px', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', userSelect: 'none' }}>
            { props.children }
        </div>
    )
}

const Divider = (props) => {
    return (
        <div style={{ width: '100%', borderBottom: '1px solid rgba(0,0,0,.1)', margin: '10px 0px 10px 0px' }}/>
    )
}

const Navbar = (props) => {
  const [profileExpanded, setProfileExpanded] = useState(false)

  const auth = useContext(AuthContext);
  const messenger = useContext(MessengerContext)
  const notifications = useContext(NotificationContext)
  const history = useHistory()
  const location = useLocation()
  const profileRef = useRef()

  const handleLogout = () => {
    api.logout().then((response) => {
      auth.logout()
    }).catch((error) => {
      console.log(error)
    })
  }

  const handleMessengerClick = () => {
    if (messenger.isOpen) {
      const search = new URLSearchParams(location.search)
      search.delete('m')
      history.replace({ search: search.toString() })
      messenger.close()
    }
    if (!messenger.isOpen) messenger.open()
  }

  const handleNotificationsClick = () => {
    if (notifications.isOpen) notifications.close()
    if (!notifications.isOpen) notifications.open()
  }

  const handleProfileClick = () => {
    setProfileExpanded((expanded) => !expanded)
  }

  const getClientBoundingRect = () => {
    if (!profileRef.current) return {}
    return profileRef.current.getBoundingClientRect()
  }
  
  return (
    <nav style={{ position: 'sticky', top: '0px', width: '100%', zIndex: '2', backgroundColor: 'black', padding: '7px', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ marginLeft: '10px', marginBottom: '0px' }} className="navbar-brand">
              TM
          </h1>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <SearchBar/>
            { auth.isLoggedIn && auth.user.admin ? <Link to='/admin/users' style={{ outline: 'none', color: 'white', textDecoration: 'none' }}>
                <NavElement> <p style={{ marginBottom: '0px', fontWeight: 'bold' }}> Admin </p> </NavElement>
            </Link> : null }
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                { auth.user && auth.isLoggedIn ? <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NavElement onClick={handleNotificationsClick}> <IoIosNotifications style={{ color: 'white', fontSize: '22px' }}/> </NavElement>
                  <NavElement onClick={handleMessengerClick}> <RiMessage3Fill style={{ color: 'white', fontSize: '22px' }}/> </NavElement>
                  <NavElement onClick={handleProfileClick}> 
                      <img ref={profileRef} src={auth.user.profile_img} style={{ height: '30px', width: '30px', borderRadius: '50%' }}/> 
                      <div style={{ backgroundColor: 'grey', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '10px', height: '10px', position: 'absolute', bottom: '-1px', right: '-1px', boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 1)' }}/>
                  </NavElement>              
                </div> : <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to='/login' style={{ outline: 'none', color: 'white', textDecoration: 'none' }}>
                      <NavElement> <p style={{ marginBottom: '0px', fontWeight: 'bold' }}> Login </p> </NavElement>
                    </Link>
                    <Link to='/signup' style={{ outline: 'none', color: 'white', textDecoration: 'none' }}>
                      <NavElement> <p style={{ marginBottom: '0px', fontWeight: 'bold' }}> Sign Up </p> </NavElement>
                    </Link>
                </div> }
            </div>
        </div>
      </div>
      { auth.isLoggedIn && profileExpanded ? <div className="profile-toggle"  style={{ position: 'absolute', top: getClientBoundingRect().bottom + 10, left: getClientBoundingRect().right + 5,  transform: 'translateX(-100%)', boxShadow: '0 0px 20px 10px rgba(0,0,0,.08)', padding: '15px', borderRadius: '10px', width: '200px', zIndex: '4'}} onClick={() => setProfileExpanded(false)}>
          <div className="profile-toggle" style={{ position: 'absolute', transform: 'rotate(45deg)', width: '15px', height: '15px', top: '-3px', right: '12px', borderRadius: '2px' }} />
          <Link to={`/users/${auth.user._id}`} style={{ outline: 'none', color: 'inherit', textDecoration: 'none' }}>
            <h6 style={{ marginBottom: '0px' }}> Signed in as </h6>
            <h6 style={{ fontWeight: 'bold', marginBottom: '0px' }}> {auth.user.first} {auth.user.last} </h6>
          </Link>
          <Divider/>
          <Link to='/profile/info' style={{ outline: 'none', color: 'inherit', textDecoration: 'none' }}>
            <h6 style={{ marginBottom: '5px' }}> Profile </h6>
          </Link>
          <Link to='/profile/orders' style={{ outline: 'none', color: 'inherit', textDecoration: 'none' }}>
            <h6 style={{ marginBottom: '5px' }}> Orders </h6>
          </Link>
          <Link to='/profile/favorites' style={{ outline: 'none', color: 'inherit', textDecoration: 'none' }}>
            <h6 style={{ marginBottom: '5px' }}> Favorites </h6>
          </Link>
          <Link to='/profile/views' style={{ outline: 'none', color: 'inherit', textDecoration: 'none' }}>
            <h6 style={{ marginBottom: '5px' }}> Views </h6>
          </Link>
          <Link to='/profile/reviews' style={{ outline: 'none', color: 'inherit', textDecoration: 'none' }}>
            <h6 style={{ marginBottom: '5px' }}> Reviews </h6>
          </Link>
          <Link to='/profile/products' style={{ outline: 'none', color: 'inherit', textDecoration: 'none' }}>
            <h6 style={{ marginBottom: '5px' }}> Products </h6>
          </Link>
          <Link to='/profile/billing' style={{ outline: 'none', color: 'inherit', textDecoration: 'none' }}>
            <h6 style={{ marginBottom: '5px' }}> Billing </h6>
          </Link>
          <Link to='/profile/preferences' style={{ outline: 'none', color: 'inherit', textDecoration: 'none' }}>
            <h6 style={{ marginBottom: '5px' }}> Preferences </h6>
          </Link>
          <h6 style={{ marginBottom: '5px', cursor: 'pointer' }} onClick={handleLogout}> Sign Out </h6>
      </div> : null }
      { auth.isLoggedIn && profileExpanded ? <div onClick={() => setProfileExpanded(false)} style={{ width: '100%', height: '100%', position: 'fixed', zIndex: '3' }}/> : null }
    </nav>
  );
};
export default Navbar;

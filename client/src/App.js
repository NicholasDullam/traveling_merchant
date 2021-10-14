import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState, useCallback, useEffect } from 'react';


import logo from "./logo.svg";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductListing from "./pages/ProductListing";
import AuthContext from "./context/auth-context";

let logoutTimer;


function App() {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    console.log("LOGGING IN Y'ALLL")
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return (
    <AuthContext.Provider
    value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout
    }}>

      {/* If (token) to restrict access to routes from unlogged users */}
    <Router>
      <Switch>
        <Route path="/login" >
        <Login></Login>
          </Route>
        <Route path="/signup">
    <Signup></Signup>
          </Route>

        <Route path="/listing">
          {/* ^ this is a dummy route path */}
          <ProductListing/>
          </Route>
        <Route path="/logout" />
        <Route path="/game" />
        <Route path="/user" />
        {/* path="/" must be the last route, before closing Switch tag */}
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;

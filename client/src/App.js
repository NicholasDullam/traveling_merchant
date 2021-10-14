import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState, useCallback, useEffect } from 'react';
import api from './api'


import logo from "./logo.svg";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductListing from "./pages/ProductListing";
import AuthContext from "./context/auth-context";

function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = useCallback((token, user) => {
      console.log(token, user)
      setToken(token)
      setUser(user)
      setUserId(user._id)
      setIsLoggedIn(true)
  }, []);

  const logout = useCallback(() => {
      setToken(null)
      setUser(null)
      setUserId(null)
      setIsLoggedIn(false)
  }, []);

  useEffect(() => {
    api.verifyToken().then((response) => {
        let { token, user } = response.data
        login(token, user)
    }).catch((error) => {
        console.log('Failed to verify Token')
    })
  }, []);

  return (
    <AuthContext.Provider
    value={{
      token,
      user,
      userId,
      isLoggedIn,
      login,
      logout
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
